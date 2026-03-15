package ua.nure.medirepairtrack.DTO.DSS.PredictedOperation;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PredictedOperationResponseDTO {

    private Integer predictionId;
    private Integer operationId;

    private BigDecimal probabilityScore;
    private Integer rankPosition;

    private BigDecimal predictedTimeSpent;

    private LocalDateTime createdAt;

}
