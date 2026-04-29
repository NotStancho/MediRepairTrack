package ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateClaimWorkDTO {

    @NotNull(message = "ID ремонтної роботи є обов'язковим")
    private Integer repairWorkId;

    @NotNull(message = "Час виконання роботи є обов'язковим")
    @DecimalMin(value = "0.01", message = "Час виконання роботи має бути більше 0")
    private BigDecimal timeSpent;

    private String note;

}
