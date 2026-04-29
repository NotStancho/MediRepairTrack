package ua.nure.medirepairtrack.Entity.claim.ClaimWork;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.repair.RepairWork.RepairWork;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_work")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_claim_work")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "fk_claim", nullable = false)
    private Claim claim;

    @ManyToOne
    @JoinColumn(name = "fk_repair_work", nullable = false)
    private RepairWork repairWork;

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
