package ua.nure.medirepairtrack.DTO.DSS.PredictedPart;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePredictedPartDTO {

    @NotNull
    private Integer predictionId;

    @NotNull
    private Integer partId;

    @NotNull
    private BigDecimal probabilityScore;

    @NotNull
    private Integer rankPosition;

}