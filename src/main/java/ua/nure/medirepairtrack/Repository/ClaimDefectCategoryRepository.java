package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.ClaimDefectCategory.ClaimDefectCategory;
import ua.nure.medirepairtrack.Entity.ClaimDefectCategory.ClaimDefectCategoryId;

import java.util.Optional;

public interface ClaimDefectCategoryRepository extends JpaRepository<ClaimDefectCategory, ClaimDefectCategoryId> {

    Optional<ClaimDefectCategory> findByClaimId(Integer claimId);

}