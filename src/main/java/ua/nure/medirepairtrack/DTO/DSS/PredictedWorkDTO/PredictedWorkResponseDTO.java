package ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.RepairWorkShortDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PredictedWorkResponseDTO {

    private Integer predictionId;
    private RepairWorkShortDTO repairWork;

    private BigDecimal probabilityScore;
    private Integer rankPosition;

    private BigDecimal predictedTimeSpent;

    private LocalDateTime createdAt;

}
