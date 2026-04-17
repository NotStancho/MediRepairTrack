package ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DiagnosisPredictionDefectId implements Serializable {

    private Integer predictionId;
    private Integer defectCategoryId;

}