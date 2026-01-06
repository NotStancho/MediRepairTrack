package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.nure.medirepairtrack.Entity.ClaimHistory.ClaimHistory;

import java.math.BigDecimal;
import java.util.List;

public interface ClaimHistoryRepository extends JpaRepository<ClaimHistory, Integer> {
    List<ClaimHistory> findByClaimIdOrderByActionDateAsc(Integer claimId);

    @Query("""
        select coalesce(sum(ch.timeSpent), 0)
        from ClaimHistory ch
        where ch.claim.id = :claimId
          and ch.actionType = 'WORK_LOG'
    """)
    BigDecimal sumWorkLogTime(Integer claimId);

    @Query("""
                select coalesce(sum(h.timeSpent), 0)
                from ClaimHistory h
                where h.claim.id = :claimId
                  and h.employee.id = :employeeId
                  and h.actionType = 'WORK_LOG'
            """)
    BigDecimal sumWorkLogTimeByEmployee(
            Integer claimId,
            Integer employeeId
    );
}
