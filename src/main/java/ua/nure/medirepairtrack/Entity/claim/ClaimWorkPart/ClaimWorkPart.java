package ua.nure.medirepairtrack.Entity.claim.ClaimWorkPart;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.claim.ClaimWork.ClaimWork;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_work_part")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ClaimWorkPart {

    @EmbeddedId
    private ClaimWorkPartId id;

    @MapsId("claimWorkId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_claim_work", nullable = false)
    private ClaimWork claimWork;

    @MapsId("partId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_part", nullable = false)
    private Part part;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
