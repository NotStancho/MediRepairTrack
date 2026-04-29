package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWork.DiagnosisPredictedWork;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWork.DiagnosisPredictedWorkId;

import java.util.List;

public interface DiagnosisPredictedWorkRepository extends JpaRepository<DiagnosisPredictedWork, DiagnosisPredictedWorkId> {

    List<DiagnosisPredictedWork> findByPredictionIdOrderByRankPosition(Integer predictionId);

    @Query("SELECT MAX(r.rankPosition) FROM DiagnosisPredictedWork r WHERE r.prediction.id = :predictionId")
    Integer findMaxRankByPredictionId(@Param("predictionId") Integer predictionId);
}