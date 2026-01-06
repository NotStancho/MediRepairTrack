package ua.nure.medirepairtrack.DTO.ClaimDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Claim.Status;

@Data
public class UpdateClaimStatusDTO {
    @NotNull
    private Status status;
}
