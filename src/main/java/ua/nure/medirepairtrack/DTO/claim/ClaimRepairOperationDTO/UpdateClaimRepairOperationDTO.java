package ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateClaimRepairOperationDTO {

    @NotNull(message = "ID ремонтної операції є обов'язковим")
    private Integer operationId;

    @NotNull(message = "Час виконання операції є обов'язковим")
    @DecimalMin(value = "0.01", message = "Час виконання операції має бути більше 0")
    private BigDecimal timeSpent;

    private String note;

}
