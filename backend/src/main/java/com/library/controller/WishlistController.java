package com.library.controller;

import com.library.model.Book;
import com.library.model.User;
import com.library.model.Wishlist;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import com.library.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/user/{studentId}")
    public ResponseEntity<List<Wishlist>> getUserWishlist(@PathVariable Long studentId) {
        return ResponseEntity.ok(wishlistRepository.findByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestParam Long studentId, @RequestParam Long bookId) {
        if (wishlistRepository.existsByStudentIdAndBookId(studentId, bookId)) {
            return ResponseEntity.badRequest().body("Already in wishlist");
        }
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));

        Wishlist wishlist = Wishlist.builder()
                .student(student)
                .book(book)
                .build();

        return ResponseEntity.ok(wishlistRepository.save(wishlist));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long id) {
        wishlistRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
