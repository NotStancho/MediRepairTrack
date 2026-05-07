package ua.nure.medirepairtrack.Entity.claim.ClaimWorkPart;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ClaimWorkPartId implements Serializable {

    @Column(name = "fk_claim_work")
    private Integer claimWorkId;

    @Column(name = "fk_part")
    private Integer partId;
}
