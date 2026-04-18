package ua.nure.medirepairtrack.DTO.client.ClientContractDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.client.ClientContract.ContractStatus;
import ua.nure.medirepairtrack.Entity.client.ClientContract.ContractType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateClientContractFullDTO {

    @NotBlank
    private String contractName;

    @NotNull
    private ContractType contractType;

    @NotNull
    private ContractStatus isActive;

    @NotNull
    private LocalDate validFrom;

    @NotNull
    private LocalDate validTo;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal discountLabor;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal discountParts;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal discountDelivery;

    private String notes;
}

