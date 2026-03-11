package ua.nure.medirepairtrack.DTO.DiagnosisDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateAutoDiagnosisDTO {

    @NotNull(message = "Заявка обовʼязкова")
    private Integer claimId;

    private String preliminaryConclusion;

    private BigDecimal estimatedCost;

    private BigDecimal estimatedTimeHours;

}
