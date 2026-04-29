package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWork;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DiagnosisPredictedWorkId implements Serializable {

    private Integer predictionId;
    private Integer repairWorkId;

}
