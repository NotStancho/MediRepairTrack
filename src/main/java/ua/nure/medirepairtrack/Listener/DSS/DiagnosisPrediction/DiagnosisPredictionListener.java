package ua.nure.medirepairtrack.Listener.DSS.DiagnosisPrediction;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.Diagnosis.DiagnosisCreatedEvent;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionService;

@Component
@RequiredArgsConstructor
public class DiagnosisPredictionListener {

    private final DiagnosisPredictionService predictionService;

    @EventListener
    public void handleDiagnosisCreated(DiagnosisCreatedEvent event) {

        predictionService.generateAutoPrediction(event.diagnosisId());
    }
}
