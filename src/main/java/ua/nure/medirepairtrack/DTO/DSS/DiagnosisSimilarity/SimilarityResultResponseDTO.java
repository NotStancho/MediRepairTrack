package ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class SimilarityResultResponseDTO {

    private Integer predictionId;
    private Integer claimId;

    private BigDecimal similarityScore;
    private Integer rankPosition;

    private LocalDateTime createdAt;
}
