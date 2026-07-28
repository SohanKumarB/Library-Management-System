package com.library.service;

import com.library.dto.DashboardStatsDTO;
import com.library.model.Book;
import com.library.model.BookIssue;
import com.library.model.Fine;
import com.library.model.Role;
import com.library.repository.BookRepository;
import com.library.repository.FineRepository;
import com.library.repository.IssueRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private FineRepository fineRepository;

    public DashboardStatsDTO getDashboardStats() {
        long totalBooks = bookRepository.count();
        List<Book> books = bookRepository.findAll();
        long availableBooks = books.stream().mapToLong(Book::getAvailableCopies).sum();
        long borrowedBooks = issueRepository.countActiveBorrowedBooks();
        long returnedBooks = issueRepository.countReturnedBooks();
        long overdueBooks = issueRepository.countOverdueBooks();
        long registeredStudents = userRepository.findByRole(Role.ROLE_STUDENT).size();

        List<Fine> fines = fineRepository.findAll();
        double paidFines = fines.stream()
                .filter(f -> "PAID".equalsIgnoreCase(f.getPaymentStatus()))
                .mapToDouble(f -> f.getAmount().doubleValue())
                .sum();

        double unpaidFines = fines.stream()
                .filter(f -> "UNPAID".equalsIgnoreCase(f.getPaymentStatus()))
                .mapToDouble(f -> f.getAmount().doubleValue())
                .sum();

        Map<String, Long> categoryDistribution = books.stream()
                .collect(Collectors.groupingBy(Book::getCategory, Collectors.counting()));

        // Sample Monthly stats calculation
        Map<String, Long> monthlyBorrowingStats = new LinkedHashMap<>();
        monthlyBorrowingStats.put("Jan", 12L);
        monthlyBorrowingStats.put("Feb", 19L);
        monthlyBorrowingStats.put("Mar", 25L);
        monthlyBorrowingStats.put("Apr", 30L);
        monthlyBorrowingStats.put("May", 22L);
        monthlyBorrowingStats.put("Jun", 45L);
        monthlyBorrowingStats.put("Jul", 60L);

        // Most borrowed books calculation
        List<BookIssue> issues = issueRepository.findAll();
        Map<String, Long> mostBorrowed = issues.stream()
                .collect(Collectors.groupingBy(i -> i.getBook().getTitle(), Collectors.counting()));

        return DashboardStatsDTO.builder()
                .totalBooks(totalBooks)
                .availableBooks(availableBooks)
                .borrowedBooks(borrowedBooks)
                .returnedBooks(returnedBooks)
                .overdueBooks(overdueBooks)
                .registeredStudents(registeredStudents)
                .totalFinesCollected(paidFines)
                .totalUnpaidFines(unpaidFines)
                .categoryDistribution(categoryDistribution)
                .monthlyBorrowingStats(monthlyBorrowingStats)
                .mostBorrowedBooks(mostBorrowed)
                .build();
    }
}
