package com.library.service;

import com.library.model.Fine;
import com.library.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FineService {

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<Fine> getAllFines() {
        return fineRepository.findAll();
    }

    public List<Fine> getStudentFines(Long studentId) {
        return fineRepository.findByStudentId(studentId);
    }

    public Fine markFineAsPaid(Long fineId, String performedBy) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine record not found"));

        fine.setPaymentStatus("PAID");
        fine.setPaymentDate(LocalDateTime.now());
        Fine updated = fineRepository.save(fine);

        auditLogService.logAction(performedBy, "PAY_FINE",
                "Marked fine ID #" + fineId + " ($" + fine.getAmount() + ") as PAID");

        return updated;
    }
}
