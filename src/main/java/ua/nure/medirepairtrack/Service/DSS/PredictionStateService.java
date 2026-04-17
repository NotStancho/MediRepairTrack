package ua.nure.medirepairtrack.Service.DSS;

import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.PredictionSource;
import ua.nure.medirepairtrack.Entity.Diagnosis.DiagnosisType;

@Component
public class PredictionStateService {

    public void markAsHybridIfNeeded(DiagnosisPrediction prediction) {
        if (prediction.getPredictionSource() == PredictionSource.AUTOMATED) {
            prediction.setPredictionSource(PredictionSource.HYBRID);
        }

        if (prediction.getDiagnosis().getDiagnosisType() == DiagnosisType.AUTOMATED) {
            prediction.getDiagnosis().setDiagnosisType(DiagnosisType.HYBRID);
        }
    }
}
