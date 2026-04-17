package ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class PredictionContext {

    private String equipmentModel;

    private String claimDescription;

    private List<SimilarCaseContext> similarCases;

    private List<PredictedDefectContext> predictedDefects;

    private List<PredictedOperationContext> predictedOperations;

    private List<PredictedPartContext> predictedParts;

    private BigDecimal predictedTimeHours;

    private BigDecimal predictedCost;

    private BigDecimal warrantyProbability;

    private BigDecimal confidenceScore;

}
