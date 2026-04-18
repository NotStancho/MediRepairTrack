package ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class EquipmentFullResponseDTO {
    // Equipment info
    private Integer id;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal price;
    private String description;

    // Model info
    private String modelName;
    private String manufacturer;
    private EquipmentType equipmentType;
    private LocalDate releaseDate;
    private String descriptionModel;
}
