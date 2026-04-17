package ua.nure.medirepairtrack.DTO.ClaimRepairOperation;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateClaimRepairOperationDTO {

    @NotNull(message = "ID заявки є обов'язковим")
    private Integer claimId;

    @NotNull(message = "ID ремонтної операції є обов'язковим")
    private Integer operationId;

    @NotNull(message = "ID інженера є обов'язковим")
    private Integer employeeId;

    @NotNull(message = "Час виконання операції є обов'язковим")
    @DecimalMin(value = "0.01", message = "Час виконання операції має бути більше 0")
    private BigDecimal timeSpent;

    private String note;

}
