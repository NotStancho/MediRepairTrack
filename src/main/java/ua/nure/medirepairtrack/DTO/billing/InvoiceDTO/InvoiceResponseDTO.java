package ua.nure.medirepairtrack.DTO.billing.InvoiceDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.billing.Invoice.InvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class InvoiceResponseDTO {

    private Integer id;
    private Integer claimId;
    private Integer clientId;
    private String clientOrganizationName;
    private String invoiceNumber;

    private BigDecimal totalBeforeDiscount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private BigDecimal totalPaid;

    private InvoiceStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime issuedAt;
    private LocalDateTime dueAt;
    private LocalDateTime closedAt;
}
