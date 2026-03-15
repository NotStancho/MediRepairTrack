package ua.nure.medirepairtrack.DTO.DSS.PredictedOperation;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePredictedOperationDTO {

    @NotNull
    private Integer predictionId;

    @NotNull
    private Integer operationId;

    @NotNull
    private BigDecimal probabilityScore;

    @NotNull
    private Integer rankPosition;

    @NotNull
    private BigDecimal predictedTimeSpent;

}
