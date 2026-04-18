package ua.nure.medirepairtrack.DTO.repair.RepairOperation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRepairOperationDTO {

    @NotNull
    private Integer complexityLevelId;

    @NotBlank
    private String name;

    @NotBlank
    private String description;

}