package ua.nure.medirepairtrack.DTO.claim.ClaimDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.CreateEquipmentDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;

@Data
public class CreateClaimByEmployeeDTO {

    @NotNull(message = "ID працівника обов'язковий")
    private Integer employeeId;

    @NotNull(message = "ID клієнта обов'язковий")
    private Integer clientId;

    @NotNull(message = "Тип ремонту обов'язковий")
    private RepairType repairType;

    @NotNull(message = "Статус заявки обов'язковий")
    private Status status;

    @NotBlank(message = "Опис несправності обов'язковий")
    private String defectDescription;

    @Valid
    @NotNull(message = "Дані обладнання обов'язкові")
    private CreateEquipmentDTO equipment;
}
