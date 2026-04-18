package ua.nure.medirepairtrack.DTO.billing.InvoiceDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.billing.Invoice.InvoiceItemType;

import java.math.BigDecimal;

@Data
@Builder
public class InvoiceDetailResponseDTO {

    private Integer id;
    private InvoiceItemType itemType;

    private String description;

    private BigDecimal quantity;
    private String unitName;

    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;
}
