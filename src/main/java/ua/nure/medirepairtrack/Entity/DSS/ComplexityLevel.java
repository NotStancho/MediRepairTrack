package ua.nure.medirepairtrack.Entity.DSS;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complexity_level")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplexityLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_complexity_level")
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
}
