package ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateSimilarityResultDTO {

    @DecimalMin(value = "0.0", message = "Коефіцієнт схожості не може бути менше 0")
    @DecimalMax(value = "1.0", message = "Коефіцієнт схожості не може бути більше 1")
    private BigDecimal similarityScore;
}
