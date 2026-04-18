package ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryStatus;

@Data
public class ChangeDeliveryStatusDTO {

    @NotNull(message = "Новий статус доставки обов'язковий")
    private DeliveryStatus status;
}
