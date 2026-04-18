package ua.nure.medirepairtrack.DTO.diagnosis.DiagnosisDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateManualDiagnosisDTO {

    @NotNull(message = "Заявка обовʼязкова")
    private Integer claimId;

    @NotNull(message = "Інженер обовʼязковий")
    private Integer engineerId;

    // optional
    private String preliminaryConclusion;

    // optional
    private BigDecimal estimatedCost;

    // optional
    private BigDecimal estimatedTimeHours;
}