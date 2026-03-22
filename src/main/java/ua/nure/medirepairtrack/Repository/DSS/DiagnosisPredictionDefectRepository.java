package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect.DiagnosisPredictionDefect;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect.DiagnosisPredictionDefectId;

import java.util.List;

public interface DiagnosisPredictionDefectRepository extends JpaRepository<DiagnosisPredictionDefect, DiagnosisPredictionDefectId> {

    List<DiagnosisPredictionDefect> findByPredictionIdOrderByRankPosition(Integer predictionId);

}