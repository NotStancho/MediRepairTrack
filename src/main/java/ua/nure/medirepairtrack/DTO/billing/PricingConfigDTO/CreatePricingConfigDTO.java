package ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;

import java.math.BigDecimal;

@Data
public class CreatePricingConfigDTO {

    @NotNull(message = "Тип ремонту обов'язковий")
    private RepairType repairType;

    @NotNull(message = "Погодинна вартість робіт обов'язкова")
    @DecimalMin(value = "0.00", message = "Погодинна вартість робіт не може бути від'ємною")
    private BigDecimal laborPricePerHour;

    @DecimalMin(value = "0.00", message = "Мінімальна кількість годин робіт не може бути від'ємною")
    private BigDecimal laborMinHours;

    @NotNull(message = "Коефіцієнт для запчастин обов'язковий")
    @DecimalMin(value = "0.00", message = "Коефіцієнт для запчастин не може бути від'ємним")
    private BigDecimal partsCoefficient;

    @NotNull(message = "Коефіцієнт для доставки обов'язковий")
    @DecimalMin(value = "0.00", message = "Коефіцієнт для доставки не може бути від'ємним")
    private BigDecimal deliveryCoefficient;

    private String description;
}
