package ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.PartShortDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PredictedWorkPartResponseDTO {

    private Integer predictionId;
    private Integer repairWorkId;

    private PartShortDTO part;

    private BigDecimal predictedQuantity;
    private BigDecimal probabilityScore;
    private Integer rankPosition;

    private LocalDateTime createdAt;

}