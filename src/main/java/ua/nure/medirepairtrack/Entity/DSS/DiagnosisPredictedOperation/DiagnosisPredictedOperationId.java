package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DiagnosisPredictedOperationId implements Serializable {

    private Integer predictionId;
    private Integer operationId;

}