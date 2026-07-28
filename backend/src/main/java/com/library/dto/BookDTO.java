package com.library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTO {
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String author;

    @NotBlank
    private String isbn;

    private String publisher;

    @NotBlank
    private String category;

    private String language;
    private String edition;
    private String shelfNumber;

    @NotNull
    @Min(1)
    private Integer totalCopies;

    private Integer availableCopies;
    private String description;
    private String coverImage;
    private String ebookUrl;
}
