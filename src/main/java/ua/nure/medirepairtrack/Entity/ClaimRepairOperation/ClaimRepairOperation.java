package ua.nure.medirepairtrack.Entity.ClaimRepairOperation;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.Employee.Employee;
import ua.nure.medirepairtrack.Entity.RepairOperation.RepairOperation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_repair_operation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRepairOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_claim_repair_operation")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "fk_claim", nullable = false)
    private Claim claim;

    @ManyToOne
    @JoinColumn(name = "fk_repair_operation", nullable = false)
    private RepairOperation operation;

    @ManyToOne
    @JoinColumn(name = "fk_employee", nullable = false)
    private Employee employee;

    @Column(name = "time_spent", nullable = false, precision = 5, scale = 2)
    private BigDecimal timeSpent;

    @Column(name = "note")
    private String note;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
