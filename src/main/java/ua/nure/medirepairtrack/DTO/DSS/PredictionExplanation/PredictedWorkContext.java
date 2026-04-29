package ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PredictedWorkContext {

    private String repairWorkName;

    private BigDecimal probability;

    private BigDecimal estimatedTime;
}
