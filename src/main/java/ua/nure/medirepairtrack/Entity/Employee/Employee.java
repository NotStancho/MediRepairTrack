package ua.nure.medirepairtrack.Entity.Employee;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.User.User;

import java.time.LocalDate;

@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_employee")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "fk_user", referencedColumnName = "id_user", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Position position;

    @Column(name = "rate_per_hour", nullable = false)
    private Double ratePerHour;

    @Column(nullable = false, length = 100)
    private String specialization;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false)
    private AvailabilityStatus availabilityStatus;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;
}