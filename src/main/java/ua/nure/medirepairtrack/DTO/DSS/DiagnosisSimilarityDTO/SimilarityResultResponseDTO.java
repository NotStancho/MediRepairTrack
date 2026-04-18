package ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarityDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.claim.ClaimDTO.ClaimShortDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class SimilarityResultResponseDTO {

    private Integer predictionId;
    private ClaimShortDTO claim;

    private BigDecimal similarityScore;
    private Integer rankPosition;

    private LocalDateTime createdAt;
}
