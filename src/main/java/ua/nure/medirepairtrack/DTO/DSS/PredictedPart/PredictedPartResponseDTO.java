package ua.nure.medirepairtrack.DTO.DSS.PredictedPart;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PredictedPartResponseDTO {

    private Integer predictionId;
    private Integer partId;

    private BigDecimal probabilityScore;
    private Integer rankPosition;

    private LocalDateTime createdAt;

}