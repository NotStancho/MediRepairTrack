package ua.nure.medirepairtrack.DTO.EquipmentDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateEquipmentDTO {

    @NotNull(message = "fk_model обов'язковий")
    private Integer modelId;

    @NotBlank
    @Size(max = 45)
    private String serialNumber;

    private LocalDate purchaseDate;

    @DecimalMin(value = "0.00", inclusive = false)
    private BigDecimal price;

    private String description;
}
