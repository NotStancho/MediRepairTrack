package ua.nure.medirepairtrack.DTO.ClaimEmployeeDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.ClaimEmployee.RoleInClaim;
import ua.nure.medirepairtrack.Entity.Employee.Position;

import java.math.BigDecimal;

@Data
@Builder
public class ClaimEmployeeResponseDTO {

    // employee
    private Integer employeeId;
    private String firstName;
    private String lastName;
    private Position position;

    // claim-employee
    private RoleInClaim roleInClaim;
    private BigDecimal hoursWorked;

    private String notes;
}