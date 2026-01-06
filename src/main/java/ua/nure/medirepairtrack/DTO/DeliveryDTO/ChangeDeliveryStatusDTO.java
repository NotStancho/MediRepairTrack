package ua.nure.medirepairtrack.DTO.DeliveryDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryStatus;

@Data
public class ChangeDeliveryStatusDTO {

    @NotNull
    private DeliveryStatus status;
}
