package com.library.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequest {
    @NotNull
    private Long issueId;

    private BigDecimal collectedFine;
    private String notes;
}
