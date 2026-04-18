package ua.nure.medirepairtrack.DTO.claim.ClaimDefectCategory;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClaimDefectCategoryResponseDTO {

    private Integer claimId;
    private Integer defectCategoryId;
    private Integer employeeId;
    private LocalDateTime createdAt;

}