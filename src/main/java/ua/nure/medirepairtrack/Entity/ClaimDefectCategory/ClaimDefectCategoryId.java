package ua.nure.medirepairtrack.Entity.ClaimDefectCategory;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ClaimDefectCategoryId implements Serializable {

    private Integer claimId;
    private Integer defectCategoryId;

}