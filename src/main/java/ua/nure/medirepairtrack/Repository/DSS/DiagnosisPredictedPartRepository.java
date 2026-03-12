package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPart;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPartId;

import java.util.List;

public interface DiagnosisPredictedPartRepository extends JpaRepository<DiagnosisPredictedPart, DiagnosisPredictedPartId> {

    List<DiagnosisPredictedPart> findByPredictionIdOrderByRankPosition(Integer predictionId);
}