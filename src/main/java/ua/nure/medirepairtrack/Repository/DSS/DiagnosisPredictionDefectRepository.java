package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect.DiagnosisPredictionDefect;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect.DiagnosisPredictionDefectId;

public interface DiagnosisPredictionDefectRepository extends JpaRepository<DiagnosisPredictionDefect, DiagnosisPredictionDefectId> {

}