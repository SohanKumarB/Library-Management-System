package com.library.service;

import com.library.model.AuditLog;
import com.library.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String username, String action, String details) {
        AuditLog log = AuditLog.builder()
                .username(username != null ? username : "System")
                .action(action)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByIdDesc();
    }
}
