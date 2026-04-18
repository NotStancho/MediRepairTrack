package ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;

import java.math.BigDecimal;

@Data
public class CreateClaimHistoryDTO {
    @NotNull
    private Integer claimId;

    @NotNull
    private Integer employeeId;

    @NotNull
    private ActionType actionType;

    @NotBlank
    private String actionDescription;

    @DecimalMin(value = "0.00", inclusive = true)
    private BigDecimal timeSpent; // для WORK_LOG, інакше 0
}
