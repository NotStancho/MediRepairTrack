package ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;

import java.math.BigDecimal;

@Data
@Builder
public class AssignedClaimDTO {
    private Integer claimId;
    private Status status;
    private RoleInClaim role;
    private BigDecimal hoursWorked;
}
