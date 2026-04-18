package ua.nure.medirepairtrack.DTO.billing.InvoiceDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateInvoiceOtherItemDTO {
    @NotBlank(message = "Опис додаткової позиції рахунку обов'язковий")
    private String description;

    @NotNull(message = "Кількість обов'язкова")
    @DecimalMin(value = "0.01", message = "Кількість має бути більшою за 0")
    private BigDecimal quantity;

    @NotBlank(message = "Одиниця виміру обов'язкова")
    private String unitName;

    @NotNull(message = "Ціна за одиницю обов'язкова")
    @DecimalMin(value = "0.00", message = "Ціна за одиницю не може бути від'ємною")
    private BigDecimal pricePerUnit;
}

