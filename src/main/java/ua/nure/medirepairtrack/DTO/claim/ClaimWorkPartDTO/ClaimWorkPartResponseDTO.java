package ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

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
}
