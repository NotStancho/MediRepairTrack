package ua.nure.medirepairtrack.Workflow;

import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.Diagnosis.DiagnosisStatus;

import java.util.Map;
import java.util.Set;

@Component
public class DiagnosisStatusMachine {

    private static final Map<DiagnosisStatus, Set<DiagnosisStatus>> TRANSITIONS = Map.of(
            DiagnosisStatus.DRAFT, Set.of(
                    DiagnosisStatus.CONFIRMED
            ),

            DiagnosisStatus.PREDICTED, Set.of(
                    DiagnosisStatus.CONFIRMED,
                    DiagnosisStatus.REJECTED
            ),

            DiagnosisStatus.CONFIRMED, Set.of(
                    DiagnosisStatus.ARCHIVED
            ),

            DiagnosisStatus.REJECTED, Set.of(),

            DiagnosisStatus.ARCHIVED, Set.of()
    );

    public Set<DiagnosisStatus> getAllowedNextStatuses(DiagnosisStatus from) {
        return TRANSITIONS.getOrDefault(from, Set.of());
    }

    public boolean canTransition(DiagnosisStatus from, DiagnosisStatus to) {
        return TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }

    // ---------- EDIT ----------

    public boolean allowsDiagnosisEdit(DiagnosisStatus status) {
        return allowedDiagnosisEditStatuses().contains(status);
    }

    public Set<DiagnosisStatus> allowedDiagnosisEditStatuses() {
        return Set.of(
                DiagnosisStatus.DRAFT,
                DiagnosisStatus.PREDICTED
        );
    }

    // ---------- CONFIRM ----------

    public boolean allowsDiagnosisConfirm(DiagnosisStatus status) {
        return allowedDiagnosisConfirmStatuses().contains(status);
    }

    public Set<DiagnosisStatus> allowedDiagnosisConfirmStatuses() {
        return Set.of(
                DiagnosisStatus.DRAFT,
                DiagnosisStatus.PREDICTED
        );
    }

    // ---------- REJECT ----------

    public boolean allowsDiagnosisReject(DiagnosisStatus status) {
        return allowedDiagnosisRejectStatuses().contains(status);
    }

    public Set<DiagnosisStatus> allowedDiagnosisRejectStatuses() {
        return Set.of(
                DiagnosisStatus.PREDICTED
        );
    }

    // ---------- ARCHIVE ----------

    public boolean allowsDiagnosisArchive(DiagnosisStatus status) {
        return allowedDiagnosisArchiveStatuses().contains(status);
    }

    public Set<DiagnosisStatus> allowedDiagnosisArchiveStatuses() {
        return Set.of(
                DiagnosisStatus.CONFIRMED
        );
    }
}