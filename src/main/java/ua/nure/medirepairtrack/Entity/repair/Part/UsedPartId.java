package ua.nure.medirepairtrack.Entity.repair.Part;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UsedPartId implements Serializable {

    @Column(name = "fk_claim")
    private Integer claimId;

    @Column(name = "fk_part")
    private Integer partId;
}
