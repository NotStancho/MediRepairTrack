package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarityResult;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarityResultId;

import java.util.List;

public interface DiagnosisSimilarityResultRepository extends JpaRepository<DiagnosisSimilarityResult, DiagnosisSimilarityResultId> {

    List<DiagnosisSimilarityResult> findByPredictionIdOrderByRankPosition(Integer predictionId);

}
