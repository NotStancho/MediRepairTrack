package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DiagnosisPredictedPartId implements Serializable {

    private Integer predictionId;
    private Integer partId;

}
