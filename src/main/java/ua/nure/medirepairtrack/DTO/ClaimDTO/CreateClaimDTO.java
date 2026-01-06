package ua.nure.medirepairtrack.DTO.ClaimDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.EquipmentDTO.CreateEquipmentDTO;

@Data
public class CreateClaimDTO {

    @NotNull(message = "Клієнт обовʼязковий")
    private Integer clientId;

    @NotBlank(message = "Опис несправності обовʼязковий")
    private String defectDescription;

    @Valid
    @NotNull(message = "Дані обладнання обовʼязкові")
    private CreateEquipmentDTO equipment;
}
