package ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateEquipmentDTO {

    @NotNull(message = "fk_model обов'язковий")
    private Integer modelId;

    @NotBlank
    @Size(max = 45)
    private String serialNumber;

    @NotNull
    private LocalDate purchaseDate;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = false)
    private BigDecimal price;

    private String description;
}
