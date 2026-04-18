package ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryProvider;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryType;

import java.math.BigDecimal;

@Data
public class CreatePostalDeliveryDTO {

    @NotNull(message = "ID заявки обов'язковий")
    private Integer claimId;

    @NotNull(message = "Тип доставки обов'язковий")
    private DeliveryType type;

    @NotNull(message = "Служба доставки обов'язкова")
    private DeliveryProvider provider;

    @NotNull(message = "Вартість доставки обов'язкова")
    @DecimalMin(value = "0.0", message = "Вартість доставки не може бути від'ємною")
    private BigDecimal price;

    private String trackingCode;

    private String description;
}
