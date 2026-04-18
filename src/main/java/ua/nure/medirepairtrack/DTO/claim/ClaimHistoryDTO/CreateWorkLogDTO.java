package ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateWorkLogDTO {
    @NotNull(message = "ID заявки обов'язковий")
    private Integer claimId;

    @NotNull(message = "ID працівника обов'язковий")
    private Integer employeeId;

    @NotNull(message = "Кількість годин обов'язкова")
    @DecimalMin(value = "0.1", message = "Кількість годин має бути більшою за 0")
    private BigDecimal hours;

    @NotBlank(message = "Опис виконаних робіт обов'язковий")
    private String description;
}
