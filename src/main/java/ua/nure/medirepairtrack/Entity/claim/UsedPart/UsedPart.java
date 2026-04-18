package ua.nure.medirepairtrack.Entity.claim.UsedPart;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;
import ua.nure.medirepairtrack.Entity.repair.Part.UsedPartId;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;

import java.math.BigDecimal;

@Entity
@Table(name = "used_part")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UsedPart {

    @EmbeddedId
    private UsedPartId id;

    @MapsId("claimId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_claim", nullable = false)
    private Claim claim;

    @MapsId("partId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_part", nullable = false)
    private Part part;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;
}
