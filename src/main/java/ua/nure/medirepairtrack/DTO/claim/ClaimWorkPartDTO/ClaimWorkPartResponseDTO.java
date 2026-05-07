package ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ClaimWorkPartResponseDTO {

    private Integer claimWorkId;

    private Integer partId;
    private String partCode;
    private String partName;

    private BigDecimal quantity;
    private BigDecimal unitPrice;

    private String unitName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
