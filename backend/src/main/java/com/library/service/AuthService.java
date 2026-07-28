package com.library.service;

import com.library.dto.AuthDTOs.*;
import com.library.model.Role;
import com.library.model.User;
import com.library.repository.UserRepository;
import com.library.security.JwtUtils;
import com.library.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditLogService auditLogService;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst().map(item -> item.getAuthority()).orElse("ROLE_STUDENT");

        auditLogService.logAction(userDetails.getUsername(), "LOGIN", "User logged in successfully");

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getName(), userDetails.getEmail(), role, userDetails.getAvatarUrl());
    }

    public MessageResponse registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new MessageResponse("Error: Email is already in use!", false);
        }

        Role role = Role.ROLE_STUDENT;
        if (signUpRequest.getRole() != null) {
            try {
                role = Role.valueOf(signUpRequest.getRole());
            } catch (Exception e) {
                role = Role.ROLE_STUDENT;
            }
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .phone(signUpRequest.getPhone())
                .department(signUpRequest.getDepartment())
                .yearOfStudy(signUpRequest.getYearOfStudy())
                .address(signUpRequest.getAddress())
                .role(role)
                .avatarUrl(signUpRequest.getAvatarUrl() != null ? signUpRequest.getAvatarUrl() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                .build();

        userRepository.save(user);

        auditLogService.logAction(user.getEmail(), "REGISTER", "New user registered with role " + role);

        return new MessageResponse("User registered successfully!", true);
    }
}
