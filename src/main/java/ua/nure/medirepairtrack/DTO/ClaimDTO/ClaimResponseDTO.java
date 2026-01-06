package ua.nure.medirepairtrack.DTO.ClaimDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.Claim.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ClaimResponseDTO {
    private Integer id;
    private Integer clientId;
    private Integer equipmentId;
    private RepairType repairType;
    private Status status;
    private String defectDescription;
    private BigDecimal totalTimeSpent;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;
}
