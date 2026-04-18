package ua.nure.medirepairtrack.DTO.billing.BillingDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class BillingResultDTO {

    private List<BillingItemDTO> laborItems;
    private List<BillingItemDTO> partsItems;
    private List<BillingItemDTO> deliveryItems;

    // totals AFTER discounts
    private BigDecimal totalLabor;
    private BigDecimal totalParts;
    private BigDecimal totalDelivery;

    // Discounts
    private BigDecimal totalBeforeDiscount;
    private BigDecimal discountAmount;

    private BigDecimal grandTotal;
}
