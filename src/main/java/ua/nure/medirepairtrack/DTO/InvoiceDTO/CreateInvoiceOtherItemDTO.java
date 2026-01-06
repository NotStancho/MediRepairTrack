package ua.nure.medirepairtrack.DTO.InvoiceDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateInvoiceOtherItemDTO {
    @NotBlank
    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal quantity;

    @NotBlank
    private String unitName;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal pricePerUnit;
}

