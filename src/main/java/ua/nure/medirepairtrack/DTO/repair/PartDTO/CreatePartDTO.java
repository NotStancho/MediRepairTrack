package ua.nure.medirepairtrack.DTO.repair.PartDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.repair.Part.UnitType;

import java.math.BigDecimal;

@Data
public class CreatePartDTO {

    @NotBlank(message = "Назва постачальника обов'язкова")
    @Size(max = 45, message = "Назва постачальника не може перевищувати 45 символів")
    private String supplierName;

    @NotBlank(message = "Код запчастини обов'язковий")
    @Size(max = 50, message = "Код запчастини не може перевищувати 50 символів")
    private String partCode;

    @NotBlank(message = "Назва запчастини обов'язкова")
    @Size(max = 100, message = "Назва запчастини не може перевищувати 100 символів")
    private String partName;

    @NotNull(message = "Кількість на складі обов'язкова")
    @DecimalMin(value = "0.000", inclusive = true, message = "Кількість на складі не може бути від'ємною")
    private BigDecimal stockQuantity;

    @NotNull(message = "Ціна запчастини обов'язкова")
    @DecimalMin(value = "0.00", inclusive = false, message = "Ціна запчастини має бути більшою за 0")
    private BigDecimal price;

    @NotBlank(message = "Одиниця виміру обов'язкова")
    @Size(max = 20, message = "Одиниця виміру не може перевищувати 20 символів")
    private String unitName;

    @NotNull(message = "Тип одиниці виміру обов'язковий")
    private UnitType unitType;

    private String description;
}
