package ua.nure.medirepairtrack.Entity.Claim;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.Client.Client;
import ua.nure.medirepairtrack.Entity.Equipment.Equipment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_claim")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_client", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_equipment", nullable = false)
    private Equipment equipment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RepairType repairType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String defectDescription;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalTimeSpent;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime closedAt;
}