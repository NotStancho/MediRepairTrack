package ua.nure.medirepairtrack.Entity.Part;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "part")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_part")
    private Integer id;

    @Column(name = "supplier_name", nullable = false, length = 45)
    private String supplierName;

    @Column(name = "part_code", nullable = false, length = 50, unique = true)
    private String partCode;

    @Column(name = "part_name", nullable = false, length = 100)
    private String partName;

    @Column(name = "stock_quantity", nullable = false, precision = 10, scale = 3)
    private BigDecimal stockQuantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "unit_name", nullable = false, length = 20)
    private String unitName; // "шт", "кг", "м"

    @Enumerated(EnumType.STRING)
    @Column(name = "unit_type", nullable = false)
    private UnitType unitType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
