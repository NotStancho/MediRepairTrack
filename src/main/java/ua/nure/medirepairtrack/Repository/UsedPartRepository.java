package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.Part.UsedPart;
import ua.nure.medirepairtrack.Entity.Part.UsedPartId;

import java.util.List;

public interface UsedPartRepository extends JpaRepository<UsedPart, UsedPartId> {
    List<UsedPart> findByIdClaimId(Integer claimId);
}
