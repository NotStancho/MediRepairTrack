package ua.nure.medirepairtrack.Entity.Diagnosis;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.Employee.Employee;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Diagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_diagnosis")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "fk_engineer", nullable = true)
    private Employee engineer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fk_claim")
    private Claim claim;

    @Column(name = "preliminary_conclusion", nullable = false)
    private String preliminaryConclusion;

    @Column(name = "final_conclusion")
    private String finalConclusion;

    @Column(name = "estimated_cost", nullable = false)
    private BigDecimal estimatedCost;

    @Column(name = "estimated_time_hours", nullable = false)
    private BigDecimal estimatedTimeHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "diagnosis_type", nullable = false)
    private DiagnosisType diagnosisType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DiagnosisStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;
}