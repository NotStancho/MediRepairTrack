package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWorkPart;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWork.DiagnosisPredictedWork;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_predicted_work_part")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisPredictedWorkPart {

    @EmbeddedId
    private DiagnosisPredictedWorkPartId id;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(
                    name = "fk_prediction",
                    referencedColumnName = "fk_prediction",
                    nullable = false,
                    insertable = false,
                    updatable = false
            ),
            @JoinColumn(
                    name = "fk_repair_work",
                    referencedColumnName = "fk_repair_work",
                    nullable = false,
                    insertable = false,
                    updatable = false
            )
    })
    private DiagnosisPredictedWork predictedWork;

    @ManyToOne
    @MapsId("partId")
    @JoinColumn(name = "fk_part")
    private Part part;

    @Column(name = "predicted_quantity", nullable = false, precision = 10, scale = 3)
    private BigDecimal predictedQuantity;

    @Column(name = "probability_score", nullable = false)
    private BigDecimal probabilityScore;

    @Column(name = "rank_position", nullable = false)
    private Integer rankPosition;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}