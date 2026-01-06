package ua.nure.medirepairtrack.Entity.Delivery;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.Claim.Claim;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_delivery")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fk_claim", referencedColumnName = "id_claim", nullable = false)
    private Claim claim;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private DeliveryType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false)
    private DeliveryProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeliveryStatus status;

    @Column(name = "tracking_code", length = 45)
    private String trackingCode;

    @Column(name = "distance_km", precision = 10, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "price_per_unit", precision = 12, scale = 2)
    private BigDecimal pricePerUnit;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "performed_at")
    private LocalDateTime performedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
