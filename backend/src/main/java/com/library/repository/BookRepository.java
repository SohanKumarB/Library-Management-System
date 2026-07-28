package com.library.repository;

import com.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    Boolean existsByIsbn(String isbn);
    List<Book> findByCategoryIgnoreCase(String category);
    
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.publisher) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(String query);

    @Query("SELECT DISTINCT b.category FROM Book b")
    List<String> findAllCategories();

    List<Book> findTop5ByOrderByIdDesc();
}
