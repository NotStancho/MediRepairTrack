package ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarity;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_similarity_result")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisSimilarityResult {

    @EmbeddedId
    private DiagnosisSimilarityResultId id;

    @ManyToOne
    @MapsId("predictionId")
    @JoinColumn(name = "fk_prediction")
    private DiagnosisPrediction prediction;

    @ManyToOne
    @MapsId("claimId")
    @JoinColumn(name = "fk_similar_claim")
    private Claim similarClaim;

    @Column(name = "similarity_score", nullable = false)
    private BigDecimal similarityScore;

    @Column(name = "rank_position", nullable = false)
    private Integer rankPosition;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}