package ua.nure.medirepairtrack.DTO.DSS.PredictedOperation;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.RepairOperation.RepairOperationShortDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PredictedOperationResponseDTO {

    private Integer predictionId;
    private RepairOperationShortDTO operation;

    private BigDecimal probabilityScore;
    private Integer rankPosition;

    private BigDecimal predictedTimeSpent;

    private LocalDateTime createdAt;

}
