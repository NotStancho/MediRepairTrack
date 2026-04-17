package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect.DiagnosisPredictionDefect;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect.DiagnosisPredictionDefectId;

import java.util.List;

public interface DiagnosisPredictionDefectRepository extends JpaRepository<DiagnosisPredictionDefect, DiagnosisPredictionDefectId> {

    List<DiagnosisPredictionDefect> findByPredictionIdOrderByRankPosition(Integer predictionId);

    @Query("SELECT MAX(r.rankPosition) FROM DiagnosisPredictionDefect r WHERE r.prediction.id = :predictionId")
    Integer findMaxRankByPredictionId(@Param("predictionId") Integer predictionId);

}