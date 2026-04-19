package ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.EquipmentModelShortDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EquipmentResponseDTO {
    private Integer id;

    private EquipmentModelShortDTO model;

    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal price;
    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}