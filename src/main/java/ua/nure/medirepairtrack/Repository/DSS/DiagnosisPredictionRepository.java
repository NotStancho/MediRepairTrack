package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;

import java.util.List;

public interface DiagnosisPredictionRepository extends JpaRepository<DiagnosisPrediction, Integer> {

    List<DiagnosisPrediction> findByDiagnosisIdOrderByCreatedAtDesc(Integer diagnosisId);

}