package ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PredictedPartContext {

    private String partName;
    private BigDecimal probability;
    private BigDecimal predictedQuantity;
    private String unitName;
    private Integer repairWorkId;

}
