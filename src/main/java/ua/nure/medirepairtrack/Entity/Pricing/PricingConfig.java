package ua.nure.medirepairtrack.Entity.Pricing;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingConfig {

    @Id
    @Enumerated(EnumType.STRING)
    @Column(name = "repair_type", nullable = false)
    private RepairType repairType;

    @Column(name = "labor_price_per_hour", nullable = false)
    private BigDecimal laborPricePerHour;

    @Column(name = "labor_min_hours")
    private BigDecimal laborMinHours;

    @Column(name = "parts_coefficient", nullable = false)
    private BigDecimal partsCoefficient;

    @Column(name = "delivery_coefficient", nullable = false)
    private BigDecimal deliveryCoefficient;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
