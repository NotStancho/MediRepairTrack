package ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentType;

import java.time.LocalDate;

@Data
public class CreateEquipmentModelDTO {
    @NotBlank(message = "Назва моделі обов'язкова")
    @Size(max = 100, message = "Назва моделі не може перевищувати 100 символів")
    private String modelName;

    @NotBlank(message = "Виробник обов'язковий")
    @Size(max = 100, message = "Назва виробника не може перевищувати 100 символів")
    private String manufacturer;

    @NotNull(message = "Тип обладнання обов'язковий")
    private EquipmentType type;

    @NotNull(message = "Дата випуску обов'язкова")
    private LocalDate releaseDate;

    private String description;
}
