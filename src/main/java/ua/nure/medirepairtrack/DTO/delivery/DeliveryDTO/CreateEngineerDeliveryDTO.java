package ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryType;

import java.math.BigDecimal;

@Data
public class CreateEngineerDeliveryDTO {

    @NotNull(message = "ID заявки обов'язковий")
    private Integer claimId;

    @NotNull(message = "Тип доставки обов'язковий")
    private DeliveryType type; // ENGINEER_ON_SITE

    @NotNull(message = "Відстань доставки обов'язкова")
    @DecimalMin(value = "0.1", message = "Відстань доставки має бути більшою за 0")
    private BigDecimal distanceKm;

    @NotNull(message = "Вартість доставки за 1 км обов'язкова")
    @DecimalMin(value = "0.0", message = "Вартість доставки за 1 км не може бути від'ємною")
    private BigDecimal pricePerUnit;

    private String description;
}
