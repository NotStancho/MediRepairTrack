package ua.nure.medirepairtrack.DTO.DiagnosisDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAutoDiagnosisDTO {

    @NotNull(message = "Заявка обовʼязкова")
    private Integer claimId;

}
