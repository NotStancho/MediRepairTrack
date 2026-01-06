package ua.nure.medirepairtrack.DTO.ClaimDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.EquipmentDTO.CreateEquipmentDTO;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;

@Data
public class UpdateClaimDTO {

    @NotNull(message = "Клієнт обовʼязковий")
    private Integer clientId;

    @Valid
    @NotNull(message = "Дані обладнання обовʼязкові")
    private CreateEquipmentDTO equipment;

    @NotNull(message = "Тип ремонту обовʼязковий")
    private RepairType repairType;

    @NotBlank(message = "Опис несправності обовʼязковий")
    private String defectDescription;
}
