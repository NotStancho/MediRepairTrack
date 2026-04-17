package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarity.DiagnosisSimilarityResult;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarity.DiagnosisSimilarityResultId;

import java.util.List;

public interface DiagnosisSimilarityResultRepository extends JpaRepository<DiagnosisSimilarityResult, DiagnosisSimilarityResultId> {

    List<DiagnosisSimilarityResult> findByPredictionIdOrderByRankPosition(Integer predictionId);

    @Query("SELECT MAX(r.rankPosition) FROM DiagnosisSimilarityResult r WHERE r.prediction.id = :predictionId")
    Integer findMaxRankByPredictionId(@Param("predictionId") Integer predictionId);

}
