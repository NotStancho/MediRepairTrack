package ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateComplexityLevelDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

}
