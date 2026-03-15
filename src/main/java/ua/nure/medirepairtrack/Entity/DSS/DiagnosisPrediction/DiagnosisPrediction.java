package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.DSS.ComplexityLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_prediction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prediction")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fk_diagnosis")
    private Diagnosis diagnosis;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fk_predicted_complexity_level")
    private ComplexityLevel predictedComplexityLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "prediction_source", nullable = false)
    private PredictionSource predictionSource;

    @Column(name = "predicted_cost", nullable = false)
    private BigDecimal predictedCost;

    @Column(name = "predicted_time_hours", nullable = false)
    private BigDecimal predictedTimeHours;

    @Column(name = "prediction_explanation", nullable = false, columnDefinition = "TEXT")
    private String predictionExplanation;

    @Column(name = "predicted_warranty_probability", nullable = false)
    private BigDecimal predictedWarrantyProbability;

    @Column(name = "confidence_score", nullable = false)
    private BigDecimal confidenceScore;

    @Column(name = "model_version", nullable = false)
    private String modelVersion;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}