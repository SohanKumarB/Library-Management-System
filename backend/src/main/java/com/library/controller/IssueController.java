package com.library.controller;

import com.library.dto.IssueRequest;
import com.library.dto.ReturnRequest;
import com.library.model.BookIssue;
import com.library.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @GetMapping
    public ResponseEntity<List<BookIssue>> getAllIssues(@RequestParam(required = false) Long studentId) {
        if (studentId != null) {
            return ResponseEntity.ok(issueService.getStudentIssues(studentId));
        }
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @PostMapping("/issue")
    public ResponseEntity<BookIssue> issueBook(@Valid @RequestBody IssueRequest request, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "System";
        return ResponseEntity.ok(issueService.issueBook(request, username));
    }

    @PostMapping("/return")
    public ResponseEntity<BookIssue> returnBook(@Valid @RequestBody ReturnRequest request, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "System";
        return ResponseEntity.ok(issueService.returnBook(request, username));
    }

    @PutMapping("/{id}/renew")
    public ResponseEntity<BookIssue> renewBook(@PathVariable Long id, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "System";
        return ResponseEntity.ok(issueService.renewBook(id, username));
    }
}
