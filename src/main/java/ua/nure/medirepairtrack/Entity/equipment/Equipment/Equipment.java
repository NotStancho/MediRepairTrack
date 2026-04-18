package ua.nure.medirepairtrack.Entity.equipment.Equipment;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentModel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "equipment",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_equipment_model_serial_number", columnNames = {"fk_model", "serial_number"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipment")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk_model", referencedColumnName = "id_model", nullable = false)
    private EquipmentModel model;

    @Column(name = "serial_number", nullable = false, length = 45)
    private String serialNumber;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
