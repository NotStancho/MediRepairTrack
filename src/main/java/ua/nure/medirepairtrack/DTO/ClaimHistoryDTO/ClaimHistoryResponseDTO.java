package ua.nure.medirepairtrack.DTO.ClaimHistoryDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.ClaimHistory.ActionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ClaimHistoryResponseDTO {

    private Integer id;
    private Integer claimId;
    private Integer employeeId;
    private ActionType actionType;
    private String description;
    private BigDecimal timeSpent;
    private LocalDateTime actionDate;
}
