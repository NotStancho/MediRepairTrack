package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperation;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperationId;

import java.util.List;

public interface DiagnosisPredictedOperationRepository extends JpaRepository<DiagnosisPredictedOperation, DiagnosisPredictedOperationId> {

    List<DiagnosisPredictedOperation> findByPredictionIdOrderByRankPosition(Integer predictionId);

    @Query("SELECT MAX(r.rankPosition) FROM DiagnosisPredictedOperation r WHERE r.prediction.id = :predictionId")
    Integer findMaxRankByPredictionId(@Param("predictionId") Integer predictionId);
}