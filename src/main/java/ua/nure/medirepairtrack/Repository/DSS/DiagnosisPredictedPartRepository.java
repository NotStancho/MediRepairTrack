package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPart;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPartId;

import java.util.List;

public interface DiagnosisPredictedPartRepository extends JpaRepository<DiagnosisPredictedPart, DiagnosisPredictedPartId> {

    List<DiagnosisPredictedPart> findByPredictionIdOrderByRankPosition(Integer predictionId);

    @Query("SELECT MAX(r.rankPosition) FROM DiagnosisPredictedPart r WHERE r.prediction.id = :predictionId")
    Integer findMaxRankByPredictionId(@Param("predictionId") Integer predictionId);
}