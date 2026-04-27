package ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;

import java.time.LocalDateTime;

@Data
@Builder
public class ClaimHistoryResponseDTO {

    private Integer id;
    private Integer claimId;
    private Integer employeeId;
    private ActionType actionType;
    private String description;
    private LocalDateTime actionDate;
}
