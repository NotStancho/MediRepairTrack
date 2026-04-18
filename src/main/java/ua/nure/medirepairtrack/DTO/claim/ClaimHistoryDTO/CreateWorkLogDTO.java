package ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateWorkLogDTO {
    @NotNull
    private Integer claimId;

    @NotNull
    private Integer employeeId;

    @NotNull
    @DecimalMin("0.1")
    private BigDecimal hours;

    @NotBlank
    private String description;
}
