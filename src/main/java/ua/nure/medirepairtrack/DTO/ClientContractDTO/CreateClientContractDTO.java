package ua.nure.medirepairtrack.DTO.ClientContractDTO;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.ClientContract.ContractType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateClientContractDTO {

    @NotNull
    private Integer clientId;

    @NotBlank
    private String contractName;

    @NotNull
    private ContractType contractType;

    @NotNull
    private LocalDate validFrom;

    @NotNull
    private LocalDate validTo;

    @NotNull
    @DecimalMin("0.0") @DecimalMax("100.0")
    private BigDecimal discountLabor;

    @NotNull
    @DecimalMin("0.0") @DecimalMax("100.0")
    private BigDecimal discountParts;

    @NotNull
    @DecimalMin("0.0") @DecimalMax("100.0")
    private BigDecimal discountDelivery;

    private String notes;
}

