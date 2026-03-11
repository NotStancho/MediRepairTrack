package ua.nure.medirepairtrack.Entity.DefectCategory;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "defect_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DefectCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_defect_category")
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "typical_symptoms", nullable = false, columnDefinition = "TEXT")
    private String typicalSymptoms;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
