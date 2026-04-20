package ua.nure.medirepairtrack.DTO.billing.PaymentDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.billing.Invoice.InvoiceStatus;
import ua.nure.medirepairtrack.Entity.billing.Payment.PaymentMethod;
import ua.nure.medirepairtrack.Entity.billing.Payment.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Data
public class PaymentViewDTO {

    private Integer id;
    private Integer invoiceId;
    private Integer claimId;
    private Integer clientId;
    private String clientOrganizationName;
    private String invoiceNumber;
    private InvoiceStatus invoiceStatus;
    private BigDecimal invoiceTotalAmount;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private String provider;
    private String externalRef;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}
