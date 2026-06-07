package ua.nure.medirepairtrack.Listener.Diagnosis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;
import ua.nure.medirepairtrack.Event.Claim.ClaimStatusChangedEvent;
import ua.nure.medirepairtrack.Service.diagnosis.DiagnosisService;

import static org.springframework.transaction.event.TransactionPhase.AFTER_COMMIT;

@Slf4j
@Component
@RequiredArgsConstructor
public class DiagnosisListener {
    private final DiagnosisService diagnosisService;

    @TransactionalEventListener(phase = AFTER_COMMIT)
    public void handleClaimAccepted(ClaimStatusChangedEvent event) {

        log.info("[EVENT] ClaimAccepted | claimId={} | diagnosis=triggered", event.claimId());

        if (event.newStatus() != Status.ACCEPTED) {
            return;
        }

        diagnosisService.ensureInitialDiagnosisExists(event.claimId());
    }
}
