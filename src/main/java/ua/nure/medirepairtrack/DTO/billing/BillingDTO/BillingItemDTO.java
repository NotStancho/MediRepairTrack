package ua.nure.medirepairtrack.DTO.billing.BillingDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BillingItemDTO {

    private String description;

    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;

    private String unitName;
}
