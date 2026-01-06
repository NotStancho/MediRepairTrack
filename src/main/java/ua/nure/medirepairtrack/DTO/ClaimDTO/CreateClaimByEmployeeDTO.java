package ua.nure.medirepairtrack.DTO.ClaimDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.EquipmentDTO.CreateEquipmentDTO;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.Claim.Status;

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