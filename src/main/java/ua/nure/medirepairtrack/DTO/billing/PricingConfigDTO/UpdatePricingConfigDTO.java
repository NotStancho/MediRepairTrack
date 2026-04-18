package ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePricingConfigDTO {

    @DecimalMin(value = "0.00", message = "Погодинна вартість робіт не може бути від'ємною")
    private BigDecimal laborPricePerHour;

    @DecimalMin(value = "0.00", message = "Мінімальна кількість годин робіт не може бути від'ємною")
    private BigDecimal laborMinHours;

    @DecimalMin(value = "0.00", message = "Коефіцієнт для запчастин не може бути від'ємним")
    private BigDecimal partsCoefficient;

    @DecimalMin(value = "0.00", message = "Коефіцієнт для доставки не може бути від'ємним")
    private BigDecimal deliveryCoefficient;

    private String description;
}
