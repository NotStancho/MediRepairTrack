package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.ClaimDefectCategory.ClaimDefectCategory;
import ua.nure.medirepairtrack.Entity.ClaimDefectCategory.ClaimDefectCategoryId;

import java.util.List;

public interface ClaimDefectCategoryRepository extends JpaRepository<ClaimDefectCategory, ClaimDefectCategoryId> {

    List<ClaimDefectCategory> findAllByClaimId(Integer claimId);

    List<ClaimDefectCategory> findAllByClaimIdOrderByCreatedAt(Integer claimId);
}