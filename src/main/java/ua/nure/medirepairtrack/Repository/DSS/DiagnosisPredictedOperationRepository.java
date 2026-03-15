package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperation;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperationId;

import java.util.List;

public interface DiagnosisPredictedOperationRepository extends JpaRepository<DiagnosisPredictedOperation, DiagnosisPredictedOperationId> {

    List<DiagnosisPredictedOperation> findByPredictionIdOrderByRankPosition(Integer predictionId);

}