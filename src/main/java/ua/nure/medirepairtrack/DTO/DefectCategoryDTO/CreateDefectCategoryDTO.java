package ua.nure.medirepairtrack.DTO.DefectCategoryDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateDefectCategoryDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotBlank
    private String typicalSymptoms;

}
