package ua.nure.medirepairtrack.DTO.BillingDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class BillingSectionResultDTO {
    private List<BillingItemDTO> items;
    private BigDecimal totalBeforeDiscount;
    private BigDecimal discountAmount;
    private BigDecimal totalAfterDiscount;
}

