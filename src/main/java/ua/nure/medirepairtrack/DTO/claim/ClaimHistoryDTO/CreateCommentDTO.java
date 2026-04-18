package ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCommentDTO {

    @NotNull(message = "ID заявки обов'язковий")
    private Integer claimId;

    @NotNull(message = "ID працівника обов'язковий")
    private Integer employeeId;

    @NotBlank(message = "Текст коментаря обов'язковий")
    private String comment;
}
