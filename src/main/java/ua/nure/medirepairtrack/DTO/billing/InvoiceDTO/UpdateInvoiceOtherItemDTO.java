package ua.nure.medirepairtrack.DTO.billing.InvoiceDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateInvoiceOtherItemDTO {

    @NotBlank(message = "Опис позиції рахунку обов'язковий")
    private String description;

    @NotNull(message = "Кількість обов'язкова")
    @DecimalMin(value = "0.01", message = "Кількість має бути більшою за 0")
    private BigDecimal quantity;

    @NotNull(message = "Ціна за одиницю обов'язкова")
    @DecimalMin(value = "0.01", message = "Ціна за одиницю має бути більшою за 0")
    private BigDecimal pricePerUnit;

    @NotBlank(message = "Одиниця виміру обов'язкова")
    private String unitName;
}

