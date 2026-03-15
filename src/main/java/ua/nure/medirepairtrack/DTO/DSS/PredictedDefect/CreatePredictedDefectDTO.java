package ua.nure.medirepairtrack.DTO.DSS.PredictedDefect;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePredictedDefectDTO {

    @NotNull
    private Integer predictionId;

    @NotNull
    private Integer defectCategoryId;

    @NotNull
    private BigDecimal probabilityScore;

    @NotNull
    private Integer rankPosition;

}