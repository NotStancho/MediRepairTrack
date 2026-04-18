package ua.nure.medirepairtrack.DTO.billing.PaymentDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.billing.Payment.PaymentMethod;

import java.math.BigDecimal;

@Data
public class CreatePaymentDTO {

    @NotNull
    private Integer invoiceId;

    @NotNull
    @DecimalMin(value = "0.01", message = "Сума оплати має бути більшою за 0")
    private BigDecimal amount;

    @NotNull
    private PaymentMethod method;

    private String provider;
    private String externalRef;
}

