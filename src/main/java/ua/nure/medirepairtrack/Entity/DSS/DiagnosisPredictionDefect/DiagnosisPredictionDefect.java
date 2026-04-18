package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.diagnosis.DefectCategory.DefectCategory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_prediction_defect")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisPredictionDefect {

    @EmbeddedId
    private DiagnosisPredictionDefectId id;

    @ManyToOne
    @MapsId("predictionId")
    @JoinColumn(name = "fk_prediction")
    private DiagnosisPrediction prediction;

    @ManyToOne
    @MapsId("defectCategoryId")
    @JoinColumn(name = "fk_defect_category")
    private DefectCategory defectCategory;

    @Column(name = "probability_score", nullable = false)
    private BigDecimal probabilityScore;

    @Column(name = "rank_position", nullable = false)
    private Integer rankPosition;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}