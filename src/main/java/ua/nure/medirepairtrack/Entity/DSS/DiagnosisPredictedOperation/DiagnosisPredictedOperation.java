package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.repair.RepairOperation.RepairOperation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_prediction_operation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisPredictedOperation {

    @EmbeddedId
    private DiagnosisPredictedOperationId id;

    @ManyToOne
    @MapsId("predictionId")
    @JoinColumn(name = "fk_prediction")
    private DiagnosisPrediction prediction;

    @ManyToOne
    @MapsId("operationId")
    @JoinColumn(name = "fk_operation")
    private RepairOperation operation;

    @Column(name = "probability_score", nullable = false)
    private BigDecimal probabilityScore;

    @Column(name = "rank_position", nullable = false)
    private Integer rankPosition;

    @Column(name = "predicted_time_spent", nullable = false)
    private BigDecimal predictedTimeSpent;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}