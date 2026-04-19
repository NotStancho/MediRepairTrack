package ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EquipmentModelShortDTO {
    private Integer id;
    private String modelName;
    private String manufacturer;
}
