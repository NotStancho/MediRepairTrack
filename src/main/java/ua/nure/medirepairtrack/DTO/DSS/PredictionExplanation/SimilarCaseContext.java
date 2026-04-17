package ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SimilarCaseContext {

    private String equipmentModel;

    private String defectDescription;

    private BigDecimal similarityScore;

}
