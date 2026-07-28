package com.library.service;

import com.library.dto.IssueRequest;
import com.library.dto.ReturnRequest;
import com.library.model.Book;
import com.library.model.BookIssue;
import com.library.model.Fine;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.FineRepository;
import com.library.repository.IssueRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    @Value("${library.fine.perDayAmount:5.0}")
    private double finePerDay;

    @Value("${library.issue.maxDaysAllowed:14}")
    private int maxDaysAllowed;

    public List<BookIssue> getAllIssues() {
        List<BookIssue> issues = issueRepository.findAll();
        // Update fine calculations for overdue items dynamically
        issues.forEach(this::calculateAndUpdateFine);
        return issues;
    }

    public List<BookIssue> getStudentIssues(Long studentId) {
        List<BookIssue> issues = issueRepository.findByStudentId(studentId);
        issues.forEach(this::calculateAndUpdateFine);
        return issues;
    }

    @Transactional
    public BookIssue issueBook(IssueRequest request, String performedBy) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is currently out of stock!");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LocalDate issueDate = request.getIssueDate() != null ? request.getIssueDate() : LocalDate.now();
        LocalDate dueDate = request.getDueDate() != null ? request.getDueDate() : issueDate.plusDays(maxDaysAllowed);

        BookIssue issue = BookIssue.builder()
                .student(student)
                .book(book)
                .issueDate(issueDate)
                .dueDate(dueDate)
                .fineAmount(BigDecimal.ZERO)
                .status("ISSUED")
                .build();

        BookIssue savedIssue = issueRepository.save(issue);

        notificationService.sendNotification(student.getId(),
                "Book '" + book.getTitle() + "' issued successfully. Due Date: " + dueDate, "INFO");

        auditLogService.logAction(performedBy, "ISSUE_BOOK",
                "Issued '" + book.getTitle() + "' to " + student.getName());

        return savedIssue;
    }

    @Transactional
    public BookIssue returnBook(ReturnRequest request, String performedBy) {
        BookIssue issue = issueRepository.findById(request.getIssueId())
                .orElseThrow(() -> new RuntimeException("Issue record not found"));

        if ("RETURNED".equals(issue.getStatus())) {
            throw new RuntimeException("Book has already been returned!");
        }

        LocalDate returnDate = LocalDate.now();
        issue.setReturnDate(returnDate);
        issue.setStatus("RETURNED");

        calculateAndUpdateFine(issue);

        // Replenish available copy
        Book book = issue.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // If fine accumulated, create or update Fine entry
        if (issue.getFineAmount().compareTo(BigDecimal.ZERO) > 0) {
            Fine fine = Fine.builder()
                    .bookIssue(issue)
                    .student(issue.getStudent())
                    .amount(issue.getFineAmount())
                    .paymentStatus(request.getCollectedFine() != null && request.getCollectedFine().compareTo(issue.getFineAmount()) >= 0 ? "PAID" : "UNPAID")
                    .build();

            if ("PAID".equals(fine.getPaymentStatus())) {
                fine.setPaymentDate(java.time.LocalDateTime.now());
            }

            fineRepository.save(fine);
        }

        BookIssue updated = issueRepository.save(issue);

        notificationService.sendNotification(issue.getStudent().getId(),
                "Book '" + book.getTitle() + "' was returned successfully.", "SUCCESS");

        auditLogService.logAction(performedBy, "RETURN_BOOK",
                "Returned '" + book.getTitle() + "' from " + issue.getStudent().getName());

        return updated;
    }

    @Transactional
    public BookIssue renewBook(Long issueId, String performedBy) {
        BookIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue record not found"));

        if (!"ISSUED".equals(issue.getStatus())) {
            throw new RuntimeException("Cannot renew a returned book!");
        }

        issue.setDueDate(issue.getDueDate().plusDays(maxDaysAllowed));
        BookIssue updated = issueRepository.save(issue);

        notificationService.sendNotification(issue.getStudent().getId(),
                "Book '" + issue.getBook().getTitle() + "' due date extended to " + issue.getDueDate(), "INFO");

        auditLogService.logAction(performedBy, "RENEW_BOOK",
                "Renewed '" + issue.getBook().getTitle() + "' for " + issue.getStudent().getName());

        return updated;
    }

    private void calculateAndUpdateFine(BookIssue issue) {
        if ("RETURNED".equals(issue.getStatus()) && issue.getFineAmount() != null && issue.getFineAmount().compareTo(BigDecimal.ZERO) > 0) {
            return;
        }

        LocalDate endDate = issue.getReturnDate() != null ? issue.getReturnDate() : LocalDate.now();
        if (endDate.isAfter(issue.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(issue.getDueDate(), endDate);
            BigDecimal fine = BigDecimal.valueOf(daysOverdue * finePerDay);
            issue.setFineAmount(fine);
            if (!"RETURNED".equals(issue.getStatus())) {
                issue.setStatus("OVERDUE");
            }
        }
    }
}
