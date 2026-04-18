package ua.nure.medirepairtrack.DTO.claim.ClaimDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.CreateEquipmentDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;

@Data
public class CreateClaimByEmployeeDTO {

    @NotNull
    private Integer employeeId;

    @NotNull
    private Integer clientId;

    @NotNull
    private RepairType repairType;

    @NotNull
    private Status status;

    @NotBlank
    private String defectDescription;

    @Valid
    @NotNull
    private CreateEquipmentDTO equipment;
}