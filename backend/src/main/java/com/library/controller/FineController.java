package com.library.controller;

import com.library.model.Fine;
import com.library.service.FineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/fines")
public class FineController {

    @Autowired
    private FineService fineService;

    @GetMapping
    public ResponseEntity<List<Fine>> getAllFines(@RequestParam(required = false) Long studentId) {
        if (studentId != null) {
            return ResponseEntity.ok(fineService.getStudentFines(studentId));
        }
        return ResponseEntity.ok(fineService.getAllFines());
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Fine> markFineAsPaid(@PathVariable Long id, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "System";
        return ResponseEntity.ok(fineService.markFineAsPaid(id, username));
    }
}
