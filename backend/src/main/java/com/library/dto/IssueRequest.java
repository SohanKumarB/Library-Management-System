package com.library.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssueRequest {
    @NotNull
    private Long studentId;

    @NotNull
    private Long bookId;

    private LocalDate issueDate;
    private LocalDate dueDate;
}
