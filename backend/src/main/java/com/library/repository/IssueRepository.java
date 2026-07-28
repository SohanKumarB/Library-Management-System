package com.library.repository;

import com.library.model.BookIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<BookIssue, Long> {
    List<BookIssue> findByStudentId(Long studentId);
    List<BookIssue> findByBookId(Long bookId);
    List<BookIssue> findByStatus(String status);
    List<BookIssue> findByStudentIdAndStatus(Long studentId, String status);

    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.status = 'ISSUED'")
    long countActiveBorrowedBooks();

    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.status = 'RETURNED'")
    long countReturnedBooks();

    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.status = 'OVERDUE' OR (bi.status = 'ISSUED' AND bi.dueDate < CURRENT_DATE)")
    long countOverdueBooks();
}
