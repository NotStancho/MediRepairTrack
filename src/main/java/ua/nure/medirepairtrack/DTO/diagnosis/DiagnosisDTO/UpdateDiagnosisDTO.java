package ua.nure.medirepairtrack.DTO.diagnosis.DiagnosisDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateDiagnosisDTO {

    private String preliminaryConclusion;

    private String finalConclusion;

    private BigDecimal estimatedCost;

    private BigDecimal estimatedTimeHours;
}
