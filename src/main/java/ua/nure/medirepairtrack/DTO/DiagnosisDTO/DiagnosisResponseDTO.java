package ua.nure.medirepairtrack.DTO.DiagnosisDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Diagnosis.DiagnosisStatus;
import ua.nure.medirepairtrack.Entity.Diagnosis.DiagnosisType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class DiagnosisResponseDTO {

    private Integer id;
    private Integer claimId;
    private Integer engineerId;

    private String preliminaryConclusion;
    private String finalConclusion;

    private BigDecimal estimatedCost;
    private BigDecimal estimatedTimeHours;

    private DiagnosisType diagnosisType;
    private DiagnosisStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime confirmedAt;

    private Boolean hasPrediction;
}