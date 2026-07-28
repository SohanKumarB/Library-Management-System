package com.library.service;

import com.library.dto.AuthDTOs.RegisterRequest;
import com.library.model.Role;
import com.library.model.User;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogService auditLogService;

    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.ROLE_STUDENT);
    }

    public Optional<User> getStudentById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> searchStudents(String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    public User createOrUpdateStudent(RegisterRequest dto, Long id, String performedBy) {
        User user;
        if (id != null) {
            user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
            user.setName(dto.getName());
            user.setEmail(dto.getEmail());
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            user.setPhone(dto.getPhone());
            user.setDepartment(dto.getDepartment());
            user.setYearOfStudy(dto.getYearOfStudy());
            user.setAddress(dto.getAddress());
            if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());

            auditLogService.logAction(performedBy, "UPDATE_STUDENT", "Updated student: " + user.getName());
        } else {
            user = User.builder()
                    .name(dto.getName())
                    .email(dto.getEmail())
                    .password(passwordEncoder.encode(dto.getPassword() != null ? dto.getPassword() : "student123"))
                    .phone(dto.getPhone())
                    .department(dto.getDepartment())
                    .yearOfStudy(dto.getYearOfStudy())
                    .address(dto.getAddress())
                    .role(Role.ROLE_STUDENT)
                    .avatarUrl(dto.getAvatarUrl() != null ? dto.getAvatarUrl() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                    .build();

            auditLogService.logAction(performedBy, "ADD_STUDENT", "Added student: " + user.getName());
        }

        return userRepository.save(user);
    }

    public void deleteStudent(Long id, String performedBy) {
        User student = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
        userRepository.deleteById(id);
        auditLogService.logAction(performedBy, "DELETE_STUDENT", "Deleted student: " + student.getName());
    }
}
