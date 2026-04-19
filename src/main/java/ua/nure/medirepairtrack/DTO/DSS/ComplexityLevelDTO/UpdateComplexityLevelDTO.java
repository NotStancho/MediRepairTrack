package ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateComplexityLevelDTO {

    @NotBlank(message = "Назва рівня складності обов'язкова")
    private String name;

    @NotBlank(message = "Опис рівня складності обов'язковий")
    private String description;
}
