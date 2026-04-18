package ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateEquipmentDTO {

    @NotNull(message = "ID моделі обладнання обов'язковий")
    private Integer modelId;

    @NotBlank(message = "Серійний номер обов'язковий")
    @Size(max = 45, message = "Серійний номер не може перевищувати 45 символів")
    private String serialNumber;

    @NotNull(message = "Дата придбання обов'язкова")
    private LocalDate purchaseDate;

    @DecimalMin(value = "0.00", inclusive = false, message = "Вартість обладнання має бути більшою за 0")
    private BigDecimal price;

    private String description;
}
