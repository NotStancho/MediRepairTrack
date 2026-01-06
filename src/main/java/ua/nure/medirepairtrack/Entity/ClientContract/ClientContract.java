package ua.nure.medirepairtrack.Entity.ClientContract;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.Client.Client;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "client_contract")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contract")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "fk_client", nullable = false)
    private Client client;

    @Column(name = "contract_name", nullable = false, length = 100)
    private String contractName;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false)
    private ContractType contractType;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_active", nullable = false)
    private ContractStatus isActive;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to", nullable = false)
    private LocalDate validTo;

    @Column(name = "discount_labor", nullable = false)
    private BigDecimal discountLabor;

    @Column(name = "discount_parts", nullable = false)
    private BigDecimal discountParts;

    @Column(name = "discount_delivery", nullable = false)
    private BigDecimal discountDelivery;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
