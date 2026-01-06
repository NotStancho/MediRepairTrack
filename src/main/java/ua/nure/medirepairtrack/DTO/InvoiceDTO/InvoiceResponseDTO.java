package ua.nure.medirepairtrack.DTO.InvoiceDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Invoice.InvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class InvoiceResponseDTO {

    private Integer id;
    private Integer claimId;
    private String invoiceNumber;

    private BigDecimal totalBeforeDiscount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private BigDecimal totalPaid;

    private InvoiceStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime issuedAt;
    private LocalDateTime closedAt;
}
