package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWorkPart.DiagnosisPredictedWorkPart;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWorkPart.DiagnosisPredictedWorkPartId;

import java.util.List;

public interface DiagnosisPredictedWorkPartRepository extends JpaRepository<DiagnosisPredictedWorkPart, DiagnosisPredictedWorkPartId> {

    List<DiagnosisPredictedWorkPart> findByIdPredictionIdOrderByRankPosition(Integer predictionId);

    List<DiagnosisPredictedWorkPart> findByIdPredictionIdAndIdRepairWorkIdOrderByRankPosition(Integer predictionId, Integer repairWorkId);

    @Query("""
                SELECT MAX(p.rankPosition)
                FROM DiagnosisPredictedWorkPart p
                WHERE p.id.predictionId = :predictionId
                    AND p.id.repairWorkId = :repairWorkId
            """)
    Integer findMaxRankByPredictionIdAndRepairWorkId(@Param("predictionId") Integer predictionId, @Param("repairWorkId") Integer repairWorkId);
}