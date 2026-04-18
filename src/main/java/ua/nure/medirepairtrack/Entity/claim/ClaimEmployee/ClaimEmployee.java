package ua.nure.medirepairtrack.Entity.claim.ClaimEmployee;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;

import java.math.BigDecimal;

@Entity
@Table(name = "claim_employee")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimEmployee {

    @EmbeddedId
    private ClaimEmployeeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("claimId")
    @JoinColumn(name = "fk_claim")
    private Claim claim;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("employeeId")
    @JoinColumn(name = "fk_employee")
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_in_claim", nullable = false)
    private RoleInClaim roleInClaim;

    @Column(name = "hours_worked", nullable = false)
    private BigDecimal hoursWorked;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

