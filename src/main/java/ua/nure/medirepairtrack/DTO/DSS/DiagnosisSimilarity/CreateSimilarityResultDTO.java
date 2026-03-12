package ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateSimilarityResultDTO {

    @NotNull
    private Integer predictionId;

    @NotNull
    private Integer similarClaimId;

    @NotNull
    private BigDecimal similarityScore;

    @NotNull
    private Integer rankPosition;
}
