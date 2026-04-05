package ua.nure.medirepairtrack.DTO.RepairOperation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RepairOperationShortDTO {

    private Integer id;

    private String name;

    private String complexityLevelName;
}