package ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ComplexityLevelResponseDTO {

    private Integer id;
    private String name;
    private String description;

}
