package ua.nure.medirepairtrack.Service.DSS;

import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.PredictionSource;

@Component
public class PredictionStateService {

    public void markAsHybridIfNeeded(DiagnosisPrediction prediction) {
        if (prediction.getPredictionSource() == PredictionSource.AUTOMATED) {
            prediction.setPredictionSource(PredictionSource.HYBRID);
        }
    }
}
