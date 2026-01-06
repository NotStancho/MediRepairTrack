package ua.nure.medirepairtrack.DTO.PartDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Part.UnitType;

import java.math.BigDecimal;

@Data
@Builder
public class PartResponseDTO {

    private Integer id;
    private String supplierName;
    private String partCode;
    private String partName;
    private BigDecimal stockQuantity;
    private BigDecimal price;
    private String unitName;
    private UnitType unitType;
    private String description;
}
