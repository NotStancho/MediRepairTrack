package ua.nure.medirepairtrack.DTO.DSS.PredictedDefect;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.DefectCategoryDTO.DefectCategoryShortResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PredictedDefectResponseDTO {

    private Integer predictionId;
    private DefectCategoryShortResponseDTO defectCategory;

    private BigDecimal probabilityScore;
    private Integer rankPosition;

    private LocalDateTime createdAt;

}