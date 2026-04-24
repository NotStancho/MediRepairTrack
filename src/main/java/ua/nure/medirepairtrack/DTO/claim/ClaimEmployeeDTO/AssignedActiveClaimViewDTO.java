package ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AssignedActiveClaimViewDTO {

    // Ідентифікація
    private Integer claimId;
    private Integer clientId;

    // Workflow
    private Status status;
    private RepairType repairType;

    // Роль
    private RoleInClaim role;

    // Час
    private BigDecimal hoursWorked;     // по працівнику
    private BigDecimal totalTimeSpent;  // по заявці
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;

    // Опис
    private String defectDescription;
}
