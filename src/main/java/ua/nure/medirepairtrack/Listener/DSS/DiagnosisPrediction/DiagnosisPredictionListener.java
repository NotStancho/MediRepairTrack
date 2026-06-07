package ua.nure.medirepairtrack.Listener.DSS.DiagnosisPrediction;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import ua.nure.medirepairtrack.Event.Diagnosis.DiagnosisAutoCreatedEvent;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionService;
import ua.nure.medirepairtrack.Service.DSS.EmbeddingService;

import static org.springframework.transaction.event.TransactionPhase.AFTER_COMMIT;

@Slf4j
@Component
@RequiredArgsConstructor
public class DiagnosisPredictionListener {

    private final DiagnosisPredictionService predictionService;
    private final EmbeddingService embeddingService;

    @Async
    @TransactionalEventListener(phase = AFTER_COMMIT)
    public void handleDiagnosisCreated(DiagnosisAutoCreatedEvent event) {
        log.info(
                "[EVENT] DiagnosisAutoCreated | diagnosisId={} | claimId={} | prediction=started",
                event.diagnosisId(),
                event.claimId()
        );

        try {
            embeddingService.generateIfMissing(event.claimId());
            predictionService.generateAutoPrediction(event.diagnosisId());

            log.info(
                    "[EVENT] DiagnosisAutoCreated | diagnosisId={} | claimId={} | prediction=completed",
                    event.diagnosisId(),
                    event.claimId()
            );
        } catch (RuntimeException ex) {
            log.error(
                    "[EVENT] DiagnosisAutoCreated | diagnosisId={} | claimId={} | prediction=failed",
                    event.diagnosisId(),
                    event.claimId(),
                    ex
            );
        }
    }
}
