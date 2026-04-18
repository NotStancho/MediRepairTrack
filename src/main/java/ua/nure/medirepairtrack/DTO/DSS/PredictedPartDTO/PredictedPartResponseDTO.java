package ua.nure.medirepairtrack.DTO.DSS.PredictedPartDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.PartShortDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PredictedPartResponseDTO {

    private Integer predictionId;
    private PartShortDTO part;

    private BigDecimal probabilityScore;
    private Integer rankPosition;

    private LocalDateTime createdAt;

}