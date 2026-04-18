package ua.nure.medirepairtrack.DTO.diagnosis.DefectCategoryDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateDefectCategoryDTO {

    @NotBlank(message = "Назва категорії дефекту обов'язкова")
    private String name;

    @NotBlank(message = "Опис категорії дефекту обов'язковий")
    private String description;

    @NotBlank(message = "Типові симптоми обов'язкові")
    private String typicalSymptoms;

}
