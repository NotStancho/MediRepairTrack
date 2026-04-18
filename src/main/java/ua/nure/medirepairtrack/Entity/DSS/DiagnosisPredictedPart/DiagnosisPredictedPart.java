package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_predicted_part")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisPredictedPart {

    @EmbeddedId
    private DiagnosisPredictedPartId id;

    @ManyToOne
    @MapsId("predictionId")
    @JoinColumn(name = "fk_prediction")
    private DiagnosisPrediction prediction;

    @ManyToOne
    @MapsId("partId")
    @JoinColumn(name = "fk_part")
    private Part part;

    @Column(name = "probability_score", nullable = false)
    private BigDecimal probabilityScore;

    @Column(name = "rank_position", nullable = false)
    private Integer rankPosition;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}