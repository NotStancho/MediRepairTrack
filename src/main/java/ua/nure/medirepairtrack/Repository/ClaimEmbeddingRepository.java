package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.ClaimEmbedding.ClaimEmbedding;

public interface ClaimEmbeddingRepository extends JpaRepository<ClaimEmbedding, Integer> {
}
