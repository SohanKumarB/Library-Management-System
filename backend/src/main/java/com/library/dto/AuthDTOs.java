package com.library.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

public class AuthDTOs {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank
        private String name;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;

        private String phone;
        private String department;
        private String yearOfStudy;
        private String address;
        private String role; // ROLE_STUDENT, ROLE_LIBRARIAN, ROLE_ADMIN
        private String avatarUrl;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private String role;
        private String avatarUrl;

        public JwtResponse(String token, Long id, String name, String email, String role, String avatarUrl) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.avatarUrl = avatarUrl;
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MessageResponse {
        private String message;
        private Boolean success = true;

        public MessageResponse(String message) {
            this.message = message;
        }
    }
}
