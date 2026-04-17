package ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DiagnosisSimilarityResultId implements Serializable {
    private Integer predictionId;
    private Integer claimId;

}