package ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;

import java.math.BigDecimal;

@Data
public class CreateClaimHistoryDTO {
    @NotNull(message = "ID заявки обов'язковий")
    private Integer claimId;

    @NotNull(message = "ID працівника обов'язковий")
    private Integer employeeId;

    @NotNull(message = "Тип дії обов'язковий")
    private ActionType actionType;

    @NotBlank(message = "Опис дії обов'язковий")
    private String actionDescription;

    @DecimalMin(value = "0.00", inclusive = true, message = "Витрачений час не може бути від'ємним")
    private BigDecimal timeSpent; // для WORK_LOG, інакше 0
}
