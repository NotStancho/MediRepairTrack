package ua.nure.medirepairtrack.DTO.ClaimEmployeeDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Claim.Status;
import ua.nure.medirepairtrack.Entity.ClaimEmployee.RoleInClaim;

import java.math.BigDecimal;

@Data
@Builder
public class AssignedClaimDTO {
    private Integer claimId;
    private Status status;
    private RoleInClaim role;
    private BigDecimal hoursWorked;
}
