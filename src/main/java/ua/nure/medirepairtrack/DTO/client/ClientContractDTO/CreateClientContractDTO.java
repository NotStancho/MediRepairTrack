package ua.nure.medirepairtrack.DTO.client.ClientContractDTO;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.client.ClientContract.ContractType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateClientContractDTO {

    @NotNull(message = "ID клієнта обов'язковий")
    private Integer clientId;

    @NotBlank(message = "Назва договору обов'язкова")
    private String contractName;

    @NotNull(message = "Тип договору обов'язковий")
    private ContractType contractType;

    @NotNull(message = "Дата початку дії договору обов'язкова")
    private LocalDate validFrom;

    @NotNull(message = "Дата завершення дії договору обов'язкова")
    private LocalDate validTo;

    @NotNull(message = "Знижка на роботи обов'язкова")
    @DecimalMin(value = "0.0", message = "Знижка на роботи не може бути меншою за 0%")
    @DecimalMax(value = "100.0", message = "Знижка на роботи не може перевищувати 100%")
    private BigDecimal discountLabor;

    @NotNull(message = "Знижка на запчастини обов'язкова")
    @DecimalMin(value = "0.0", message = "Знижка на запчастини не може бути меншою за 0%")
    @DecimalMax(value = "100.0", message = "Знижка на запчастини не може перевищувати 100%")
    private BigDecimal discountParts;

    @NotNull(message = "Знижка на доставку обов'язкова")
    @DecimalMin(value = "0.0", message = "Знижка на доставку не може бути меншою за 0%")
    @DecimalMax(value = "100.0", message = "Знижка на доставку не може перевищувати 100%")
    private BigDecimal discountDelivery;

    private String notes;
}

