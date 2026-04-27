package ua.nure.medirepairtrack.Entity.claim.ClaimHistory;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_claim_history")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_claim", nullable = false)
    private Claim claim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_employee", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false, length = 30)
    private ActionType actionType;

    @Column(name = "action_date", nullable = false)
    private LocalDateTime actionDate;

    @Column(name = "action_description", nullable = false, columnDefinition = "TEXT")
    private String actionDescription;
}
