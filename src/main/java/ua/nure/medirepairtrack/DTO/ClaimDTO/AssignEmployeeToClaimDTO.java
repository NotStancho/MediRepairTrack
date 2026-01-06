package ua.nure.medirepairtrack.DTO.ClaimDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.ClaimEmployee.RoleInClaim;

@Data
public class AssignEmployeeToClaimDTO {

    @NotNull
    private Integer managerId;

    @NotNull
    private Integer employeeId;

    @NotNull
    private RoleInClaim role;
}
