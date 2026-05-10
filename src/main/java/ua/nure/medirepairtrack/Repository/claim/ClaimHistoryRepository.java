package ua.nure.medirepairtrack.Repository.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ClaimHistory;

import java.util.List;

public interface ClaimHistoryRepository extends JpaRepository<ClaimHistory, Integer> {

    @Query("""
            select h
            from ClaimHistory h
            join fetch h.claim
            join fetch h.employee e
            join fetch e.user
            where h.claim.id = :claimId
            order by h.actionDate desc
            """)
    List<ClaimHistory> findByClaimIdOrderByActionDateAsc(@Param("claimId") Integer claimId);
}
