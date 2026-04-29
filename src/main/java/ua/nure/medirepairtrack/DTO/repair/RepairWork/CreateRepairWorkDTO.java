package ua.nure.medirepairtrack.DTO.repair.RepairWork;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRepairWorkDTO {

    @NotNull(message = "ID рівня складності обов'язковий")
    private Integer complexityLevelId;

    @NotBlank(message = "Назва ремонтної роботи обов'язкова")
    private String name;

    @NotBlank(message = "Опис ремонтної роботи обов'язковий")
    private String description;

}
