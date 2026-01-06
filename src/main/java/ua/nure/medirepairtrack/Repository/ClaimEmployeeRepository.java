package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.ClaimEmployee.ClaimEmployee;
import ua.nure.medirepairtrack.Entity.ClaimEmployee.ClaimEmployeeId;

import java.util.List;

public interface ClaimEmployeeRepository extends JpaRepository<ClaimEmployee, ClaimEmployeeId> {
    List<ClaimEmployee> findByClaimId(Integer claimId);

    List<ClaimEmployee> findByEmployeeId(Integer employeeId);

    List<ClaimEmployee> findByEmployeeIdAndClaim_ClosedAtIsNull(Integer employeeId);

    boolean existsByIdClaimIdAndIdEmployeeId(Integer claimId, Integer employeeId);
}
