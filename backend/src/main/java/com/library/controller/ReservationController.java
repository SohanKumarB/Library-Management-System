package com.library.controller;

import com.library.model.Book;
import com.library.model.Reservation;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.ReservationRepository;
import com.library.repository.UserRepository;
import com.library.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations(@RequestParam(required = false) Long studentId) {
        if (studentId != null) {
            return ResponseEntity.ok(reservationRepository.findByStudentId(studentId));
        }
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestParam Long studentId, @RequestParam Long bookId, Authentication authentication) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));

        Reservation reservation = Reservation.builder()
                .student(student)
                .book(book)
                .status("PENDING")
                .build();

        Reservation saved = reservationRepository.save(reservation);
        String username = authentication != null ? authentication.getName() : student.getEmail();
        auditLogService.logAction(username, "RESERVE_BOOK", "Reserved book: " + book.getTitle());

        return ResponseEntity.ok(saved);
    }
}
