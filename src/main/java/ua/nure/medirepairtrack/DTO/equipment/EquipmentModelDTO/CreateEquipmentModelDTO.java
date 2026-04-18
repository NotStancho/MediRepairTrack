package ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentType;

import java.time.LocalDate;

@Data
public class CreateEquipmentModelDTO {
    @NotBlank
    @Size(max = 100)
    private String modelName;

    @NotBlank
    @Size(max = 100)
    private String manufacturer;

    @NotNull
    private EquipmentType type;

    @NotNull
    private LocalDate releaseDate;

    private String description;
}