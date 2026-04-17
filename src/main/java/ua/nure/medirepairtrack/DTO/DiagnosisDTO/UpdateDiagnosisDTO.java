package ua.nure.medirepairtrack.DTO.DiagnosisDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateDiagnosisDTO {

    private String preliminaryConclusion;

    private String finalConclusion;

    private BigDecimal estimatedCost;

    private BigDecimal estimatedTimeHours;
}
