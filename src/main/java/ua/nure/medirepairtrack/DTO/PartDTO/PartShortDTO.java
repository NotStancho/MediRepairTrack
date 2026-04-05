package ua.nure.medirepairtrack.DTO.PartDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@Builder
public class PartShortDTO {

    private Integer id;

    private String partCode;
    private String partName;

    private BigDecimal price;
    private String unitName;
}