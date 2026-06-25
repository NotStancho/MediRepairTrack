package ua.nure.medirepairtrack.Listener.DSS.DiagnosisPrediction;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import ua.nure.medirepairtrack.Event.Diagnosis.DiagnosisAutoCreatedEvent;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionJobService;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionService;
import ua.nure.medirepairtrack.Service.DSS.EmbeddingService;
import ua.nure.medirepairtrack.Service.DSS.PredictionDemoDelayService;

import static org.springframework.transaction.event.TransactionPhase.AFTER_COMMIT;

@Slf4j
@Component
@RequiredArgsConstructor
public class DiagnosisPredictionListener {

    private final PredictionDemoDelayService demoDelayService;

    private final DiagnosisPredictionService predictionService;
    private final EmbeddingService embeddingService;
    private final DiagnosisPredictionJobService predictionJobService;

    @Async
    @TransactionalEventListener(phase = AFTER_COMMIT)
    public void handleDiagnosisCreated(DiagnosisAutoCreatedEvent event) {
        log.info(
                "[EVENT] DiagnosisAutoCreated | diagnosisId={} | claimId={} | prediction=started",
                event.diagnosisId(),
                event.claimId()
        );

        try {
            predictionJobService.start(event.diagnosisId());
            predictionJobService.running(
                    event.diagnosisId(),
                    5,
                    "STARTING",
                    "Починаємо автоматичне формування прогнозу."
            );
            demoDelayService.waitIfEnabled();
            predictionJobService.running(
                    event.diagnosisId(),
                    15,
                    "EMBEDDING",
                    "Аналізуємо опис несправності та готуємо дані заявки."
            );
            demoDelayService.waitIfEnabled();
            embeddingService.generateIfMissing(event.claimId());
            predictionJobService.running(
                    event.diagnosisId(),
                    25,
                    "EMBEDDING_READY",
                    "Опис несправності проаналізовано. Переходимо до прогнозування."
            );
            demoDelayService.waitIfEnabled();
            predictionService.generateAutoPrediction(event.diagnosisId(), event.similaritySearchMode());
            predictionJobService.complete(event.diagnosisId());

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
            predictionJobService.fail(
                    event.diagnosisId(),
                    ex.getMessage() != null ? ex.getMessage() : "Невідома помилка під час формування прогнозу DSS"
            );
        }
    }
}
