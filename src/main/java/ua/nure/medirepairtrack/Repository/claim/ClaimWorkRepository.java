package ua.nure.medirepairtrack.Repository.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.nure.medirepairtrack.Entity.claim.ClaimWork.ClaimWork;

import java.math.BigDecimal;
import java.util.List;

public interface ClaimWorkRepository extends JpaRepository<ClaimWork, Integer> {
    List<ClaimWork> findByClaimId(Integer claimId);

    List<ClaimWork> findByClaimIdOrderByCreatedAt(Integer claimId);

    @Query("""
        select coalesce(sum(cw.timeSpent), 0)
        from ClaimWork cw
        where cw.claim.id = :claimId
    """)
    BigDecimal sumTimeSpentByClaim(Integer claimId);

    @Query("""
        select coalesce(sum(cw.timeSpent), 0)
        from ClaimWork cw
        where cw.claim.id = :claimId
          and cw.employee.id = :employeeId
    """)
    BigDecimal sumTimeSpentByClaimAndEmployee(Integer claimId, Integer employeeId);
}
