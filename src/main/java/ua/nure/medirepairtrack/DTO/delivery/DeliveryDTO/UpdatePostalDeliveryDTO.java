package ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePostalDeliveryDTO {

    @NotNull(message = "Вартість доставки обов'язкова")
    @DecimalMin(value = "0.0", message = "Вартість доставки не може бути від'ємною")
    private BigDecimal price;

    private String trackingCode;

    private String description;
}

