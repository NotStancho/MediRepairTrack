package ua.nure.medirepairtrack.Repository.diagnosis;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.diagnosis.Diagnosis.Diagnosis;

import java.util.List;
import java.util.Optional;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Integer> {
    List<Diagnosis> findByClaimIdOrderByCreatedAtDesc(Integer claimId);

    Optional<Diagnosis> findFirstByClaimId(Integer claimId);
}
