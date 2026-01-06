package ua.nure.medirepairtrack.DTO.PartDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class UsedPartResponseDTO {

    private Integer claimId;

    private Integer partId;
    private String partCode;
    private String partName;

    private BigDecimal quantity;
    private BigDecimal unitPrice;

    private String unitName;
}
