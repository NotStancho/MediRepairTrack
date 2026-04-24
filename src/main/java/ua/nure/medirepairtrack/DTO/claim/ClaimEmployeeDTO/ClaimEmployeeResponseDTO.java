package ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;

import java.math.BigDecimal;

@Data
@Builder
public class ClaimEmployeeResponseDTO {

    // employee
    private Integer employeeId;
    private String firstName;
    private String lastName;
    private Position position;
    private Double ratePerHour;

    // claim-employee
    private RoleInClaim roleInClaim;
    private BigDecimal hoursWorked;

    private String notes;
}
