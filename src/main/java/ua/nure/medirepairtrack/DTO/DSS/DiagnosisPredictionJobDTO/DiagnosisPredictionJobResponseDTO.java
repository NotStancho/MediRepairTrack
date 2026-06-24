package ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionJobDTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiagnosisPredictionJobResponseDTO {
    private Integer diagnosisId;
    private DiagnosisPredictionJobStatus status;
    private Integer progress;
    private String currentStage;
    private String message;
    private String errorMessage;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
}
