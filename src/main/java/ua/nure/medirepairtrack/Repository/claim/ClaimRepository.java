package ua.nure.medirepairtrack.Repository.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Integer> {

    List<Claim> findByClientId(Integer clientId);

    List<Claim> findByClosedAtIsNull();

    List<Claim> findByStatus(Status status);
}
