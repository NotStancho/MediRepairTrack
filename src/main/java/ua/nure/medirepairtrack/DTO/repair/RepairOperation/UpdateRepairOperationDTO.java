package ua.nure.medirepairtrack.DTO.repair.RepairOperation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRepairOperationDTO {

    @NotNull(message = "ID рівня складності обов'язковий")
    private Integer complexityLevelId;

    @NotBlank(message = "Назва ремонтної операції обов'язкова")
    private String name;

    @NotBlank(message = "Опис ремонтної операції обов'язковий")
    private String description;

}
