package ua.nure.medirepairtrack.Entity.ClaimDefectCategory;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.DefectCategory.DefectCategory;
import ua.nure.medirepairtrack.Entity.Employee.Employee;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim_defect_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimDefectCategory {

    @EmbeddedId
    private ClaimDefectCategoryId id;

    @ManyToOne
    @MapsId("claimId")
    @JoinColumn(name = "fk_claim")
    private Claim claim;

    @ManyToOne
    @MapsId("defectCategoryId")
    @JoinColumn(name = "fk_defect_category")
    private DefectCategory defectCategory;

    @ManyToOne
    @JoinColumn(name = "fk_employee", nullable = false)
    private Employee employee;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}