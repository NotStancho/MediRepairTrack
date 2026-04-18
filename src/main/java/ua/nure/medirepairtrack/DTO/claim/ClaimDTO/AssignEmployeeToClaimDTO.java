package ua.nure.medirepairtrack.DTO.claim.ClaimDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;

@Data
public class AssignEmployeeToClaimDTO {

    @NotNull(message = "ID менеджера заявки обов'язковий")
    private Integer managerId;

    @NotNull(message = "ID працівника обов'язковий")
    private Integer employeeId;

    @NotNull(message = "Роль працівника в заявці обов'язкова")
    private RoleInClaim role;
}
