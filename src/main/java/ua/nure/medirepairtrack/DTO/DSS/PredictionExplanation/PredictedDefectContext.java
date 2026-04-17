package ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PredictedDefectContext {

    private String name;

    private String description;

    private BigDecimal probability;
}