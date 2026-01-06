package ua.nure.medirepairtrack.DTO.EquipmentDTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class EquipmentResponseDTO {
    private Integer id;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal price;
    private String description;
}