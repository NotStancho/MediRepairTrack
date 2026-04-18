package ua.nure.medirepairtrack.DTO.claim.ClaimDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;

@Data
public class UpdateClaimStatusDTO {
    @NotNull
    private Status status;
}
