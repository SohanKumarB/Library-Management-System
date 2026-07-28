package com.library.dto;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalBooks;
    private long availableBooks;
    private long borrowedBooks;
    private long returnedBooks;
    private long overdueBooks;
    private long registeredStudents;
    private double totalFinesCollected;
    private double totalUnpaidFines;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> monthlyBorrowingStats;
    private Map<String, Long> mostBorrowedBooks;
}
