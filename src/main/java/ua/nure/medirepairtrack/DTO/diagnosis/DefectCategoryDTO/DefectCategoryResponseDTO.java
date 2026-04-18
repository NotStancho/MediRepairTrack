package ua.nure.medirepairtrack.DTO.diagnosis.DefectCategoryDTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DefectCategoryResponseDTO {

    private Integer id;
    private String name;
    private String description;
    private String typicalSymptoms;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
