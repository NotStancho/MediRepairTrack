package ua.nure.medirepairtrack.Repository.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.claim.UsedPart.UsedPart;
import ua.nure.medirepairtrack.Entity.repair.Part.UsedPartId;

import java.util.List;

public interface UsedPartRepository extends JpaRepository<UsedPart, UsedPartId> {
    List<UsedPart> findByIdClaimId(Integer claimId);
}
