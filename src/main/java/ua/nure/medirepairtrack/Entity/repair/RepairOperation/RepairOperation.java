package ua.nure.medirepairtrack.Entity.repair.RepairOperation;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.DSS.ComplexityLevel;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;

import java.time.LocalDateTime;

@Entity
@Table(name = "repair_operation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_operation")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "fk_complexity_level", nullable = false)
    private ComplexityLevel complexityLevel;

    @Column(nullable = false, length = 50, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "created_by_employee", nullable = false)
    private Employee createdByEmployee;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
