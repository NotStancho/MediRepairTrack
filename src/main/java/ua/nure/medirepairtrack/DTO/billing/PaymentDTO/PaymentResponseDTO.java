package ua.nure.medirepairtrack.DTO.billing.PaymentDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.billing.Payment.PaymentMethod;
import ua.nure.medirepairtrack.Entity.billing.Payment.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Data
public class PaymentResponseDTO {

    private Integer id;
    private Integer invoiceId;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private String provider;
    private String externalRef;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}

