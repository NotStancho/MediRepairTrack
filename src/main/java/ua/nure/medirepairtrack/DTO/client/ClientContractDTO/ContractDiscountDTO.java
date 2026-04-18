package ua.nure.medirepairtrack.DTO.client.ClientContractDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ContractDiscountDTO {

    private BigDecimal discountLabor;
    private BigDecimal discountParts;
    private BigDecimal discountDelivery;
}

