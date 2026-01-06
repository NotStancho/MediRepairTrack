package ua.nure.medirepairtrack.DTO.ClaimHistoryDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateWorkLogDTO {
    private Integer employeeId;
    private String description;
    private BigDecimal hours;
}
