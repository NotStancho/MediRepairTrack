package ua.nure.medirepairtrack.DTO.diagnosis.DiagnosisDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.DSS.Similarity.SimilaritySearchMode;

@Data
public class CreateAutoDiagnosisDTO {

    @NotNull(message = "Заявка обовʼязкова")
    private Integer claimId;

    private SimilaritySearchMode similaritySearchMode;
}
