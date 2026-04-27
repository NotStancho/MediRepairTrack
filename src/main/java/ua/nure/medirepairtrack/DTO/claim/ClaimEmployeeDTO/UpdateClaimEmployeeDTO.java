package ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;

@Data
public class UpdateClaimEmployeeDTO {

    @NotNull(message = "ID працівника, який виконує дію, обов'язковий")
    private Integer performedByEmployeeId;

    @NotNull(message = "Роль працівника в заявці обов'язкова")
    private RoleInClaim roleInClaim;

    private String notes;
}
