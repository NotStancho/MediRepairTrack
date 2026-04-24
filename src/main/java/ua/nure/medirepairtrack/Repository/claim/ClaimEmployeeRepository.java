package ua.nure.medirepairtrack.Repository.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.ClaimEmployee;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.ClaimEmployeeId;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ClaimEmployeeRepository extends JpaRepository<ClaimEmployee, ClaimEmployeeId> {
    List<ClaimEmployee> findByClaimId(Integer claimId);

    List<ClaimEmployee> findByEmployeeId(Integer employeeId);

    List<ClaimEmployee> findByEmployeeIdAndClaim_StatusIn(Integer employeeId, Collection<Status> statuses);

    boolean existsByIdClaimIdAndIdEmployeeId(Integer claimId, Integer employeeId);

    Optional<ClaimEmployee> findByIdClaimIdAndIdEmployeeId(Integer claimId, Integer employeeId);

    boolean existsByClaimIdAndRoleInClaim(Integer claimId, RoleInClaim role);
}
