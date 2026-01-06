package ua.nure.medirepairtrack.DTO.InvoiceDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateInvoiceOtherItemDTO {

    @NotBlank
    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal quantity;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal pricePerUnit;

    @NotBlank
    private String unitName;
}

