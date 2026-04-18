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
    @Column(nullable = false, name = "symptom_embedding")
    private byte[] symptomEmbedding;

    @Column(nullable = false, name = "symptom_dimension")
    private int symptomDimension;

    @Lob
    @Column(nullable = false, name = "context_embedding")
    private byte[] contextEmbedding;

    @Column(nullable = false, name = "context_dimension")
    private int contextDimension;

    @Column(nullable = false, name = "model_name", length = 50)
    private String modelName;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;
}
