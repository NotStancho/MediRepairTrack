package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DSS.ClaimEmbedding.ClaimEmbedding;

import java.util.List;

public interface ClaimEmbeddingRepository extends JpaRepository<ClaimEmbedding, Integer> {
    List<ClaimEmbedding> findByClaimIdNot(Integer claimId);
}
