package ua.nure.medirepairtrack.Repository.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.claim.ClaimWorkPart.ClaimWorkPart;
import ua.nure.medirepairtrack.Entity.claim.ClaimWorkPart.ClaimWorkPartId;

import java.util.List;

public interface ClaimWorkPartRepository extends JpaRepository<ClaimWorkPart, ClaimWorkPartId> {
    List<ClaimWorkPart> findByIdClaimWorkId(Integer claimWorkId);

    List<ClaimWorkPart> findByClaimWorkClaimId(Integer claimId);
}
