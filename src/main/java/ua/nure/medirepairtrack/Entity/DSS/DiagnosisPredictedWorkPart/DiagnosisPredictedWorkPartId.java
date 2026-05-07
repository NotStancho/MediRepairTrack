package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWorkPart;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DiagnosisPredictedWorkPartId implements Serializable {

    @Column(name = "fk_prediction")
    private Integer predictionId;

    @Column(name = "fk_repair_work")
    private Integer repairWorkId;

    @Column(name = "fk_part")
    private Integer partId;

}
