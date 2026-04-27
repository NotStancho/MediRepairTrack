package ua.nure.medirepairtrack.Repository.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.nure.medirepairtrack.Entity.claim.ClaimRepairOperation.ClaimRepairOperation;

import java.math.BigDecimal;
import java.util.List;

public interface ClaimRepairOperationRepository extends JpaRepository<ClaimRepairOperation, Integer> {
    List<ClaimRepairOperation> findByClaimId(Integer claimId);

    List<ClaimRepairOperation> findByClaimIdOrderByCreatedAt(Integer claimId);

    @Query("""
        select coalesce(sum(cro.timeSpent), 0)
        from ClaimRepairOperation cro
        where cro.claim.id = :claimId
    """)
    BigDecimal sumTimeSpentByClaim(Integer claimId);

    @Query("""
        select coalesce(sum(cro.timeSpent), 0)
        from ClaimRepairOperation cro
        where cro.claim.id = :claimId
          and cro.employee.id = :employeeId
    """)
    BigDecimal sumTimeSpentByClaimAndEmployee(Integer claimId, Integer employeeId);
}
