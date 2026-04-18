package ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ClaimRepairOperationResponseDTO {

    private Integer id;

    private Integer claimId;
    private Integer operationId;
    private Integer employeeId;

    private BigDecimal timeSpent;

    private String note;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
