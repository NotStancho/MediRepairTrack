package ua.nure.medirepairtrack.Entity.DSS.ClaimEmbedding;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim_embedding")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimEmbedding {
    @Id
    @Column(name = "fk_claim")
    private Integer claimId;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "fk_claim")
    private Claim claim;

    @Lob
    @Column(nullable = false, name = "embedding_vector")
    private byte[] embeddingVector;

    @Column(nullable = false, name = "dimension")
    private int dimension;

    @Column(nullable = false, name = "model_name", length = 50)
    private String modelName;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;
}
