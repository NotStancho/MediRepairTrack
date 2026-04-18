package ua.nure.medirepairtrack.DTO.client.ClientContractDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.client.ClientContract.ContractStatus;
import ua.nure.medirepairtrack.Entity.client.ClientContract.ContractType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ClientContractResponseDTO {

    private Integer id;
    private Integer clientId;

    private String contractName;
    private ContractType contractType;
    private ContractStatus status;

    private LocalDate validFrom;
    private LocalDate validTo;

    private BigDecimal discountLabor;
    private BigDecimal discountParts;
    private BigDecimal discountDelivery;
}

