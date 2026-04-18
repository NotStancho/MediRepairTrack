package ua.nure.medirepairtrack.DTO.diagnosis.DefectCategoryDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DefectCategoryShortResponseDTO {

    private Integer id;
    private String name;
    private String typicalSymptoms;
    private String description;
}
