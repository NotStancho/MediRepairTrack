package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.ClaimRepairOperation.ClaimRepairOperation;

import java.util.List;

public interface ClaimRepairOperationRepository extends JpaRepository<ClaimRepairOperation, Integer> {
    List<ClaimRepairOperation> findByClaimId(Integer claimId);

    List<ClaimRepairOperation> findByClaimIdOrderByCreatedAt(Integer claimId);
}
