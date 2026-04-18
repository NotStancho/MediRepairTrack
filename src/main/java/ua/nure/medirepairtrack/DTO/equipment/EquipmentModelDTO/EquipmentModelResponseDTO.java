package ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EquipmentModelResponseDTO {
    private Integer id;
    private String modelName;
    private String manufacturer;
    private EquipmentType type;
    private LocalDate releaseDate;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}