package ua.nure.medirepairtrack.DTO.ClaimHistoryDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCommentDTO {

    @NotNull
    private Integer claimId;

    @NotNull
    private Integer employeeId;

    @NotBlank
    private String comment;
}
