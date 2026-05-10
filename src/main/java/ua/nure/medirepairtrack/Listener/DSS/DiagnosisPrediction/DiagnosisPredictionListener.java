package ua.nure.medirepairtrack.Listener.DSS.DiagnosisPrediction;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.Diagnosis.DiagnosisAutoCreatedEvent;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionService;
import ua.nure.medirepairtrack.Service.DSS.EmbeddingService;

@Component
@RequiredArgsConstructor
public class DiagnosisPredictionListener {

    private final DiagnosisPredictionService predictionService;
    private final EmbeddingService embeddingService;

    @EventListener
    public void handleDiagnosisCreated(DiagnosisAutoCreatedEvent event) {
        embeddingService.generateIfMissing(event.claimId());
        predictionService.generateAutoPrediction(event.diagnosisId());
    }
}
