package com.library.service;

import com.library.dto.BookDTO;
import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public List<Book> searchBooks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllBooks();
        }
        return bookRepository.searchBooks(query);
    }

    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategoryIgnoreCase(category);
    }

    public List<String> getAllCategories() {
        return bookRepository.findAllCategories();
    }

    public Book saveBook(BookDTO dto, String performedBy) {
        Book book;
        if (dto.getId() != null) {
            book = bookRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            book.setTitle(dto.getTitle());
            book.setAuthor(dto.getAuthor());
            book.setIsbn(dto.getIsbn());
            book.setPublisher(dto.getPublisher());
            book.setCategory(dto.getCategory());
            book.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "English");
            book.setEdition(dto.getEdition());
            book.setShelfNumber(dto.getShelfNumber());
            book.setTotalCopies(dto.getTotalCopies());
            if (dto.getAvailableCopies() != null) {
                book.setAvailableCopies(dto.getAvailableCopies());
            }
            book.setDescription(dto.getDescription());
            book.setCoverImage(dto.getCoverImage());
            book.setEbookUrl(dto.getEbookUrl());

            auditLogService.logAction(performedBy, "UPDATE_BOOK", "Updated book: " + book.getTitle());
        } else {
            book = Book.builder()
                    .title(dto.getTitle())
                    .author(dto.getAuthor())
                    .isbn(dto.getIsbn())
                    .publisher(dto.getPublisher())
                    .category(dto.getCategory())
                    .language(dto.getLanguage() != null ? dto.getLanguage() : "English")
                    .edition(dto.getEdition())
                    .shelfNumber(dto.getShelfNumber())
                    .totalCopies(dto.getTotalCopies())
                    .availableCopies(dto.getTotalCopies())
                    .description(dto.getDescription())
                    .coverImage(dto.getCoverImage())
                    .ebookUrl(dto.getEbookUrl())
                    .build();

            auditLogService.logAction(performedBy, "ADD_BOOK", "Added new book: " + book.getTitle());
        }

        return bookRepository.save(book);
    }

    public void deleteBook(Long id, String performedBy) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        bookRepository.deleteById(id);
        auditLogService.logAction(performedBy, "DELETE_BOOK", "Deleted book: " + book.getTitle());
    }
}
