package ua.nure.medirepairtrack.Repository.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ClaimHistory;

import java.util.List;

public interface ClaimHistoryRepository extends JpaRepository<ClaimHistory, Integer> {
    List<ClaimHistory> findByClaimIdOrderByActionDateAsc(Integer claimId);
}
