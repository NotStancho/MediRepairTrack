package ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class PredictedWorkContext {

    private Integer repairWorkId;
    private String repairWorkName;

    private BigDecimal probability;
    private BigDecimal estimatedTime;

    private List<PredictedWorkPartContext> predictedParts;
}
