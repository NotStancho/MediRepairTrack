package ua.nure.medirepairtrack.DTO.repair.RepairWork;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RepairWorkShortDTO {

    private Integer id;

    private String name;

    private String complexityLevelName;
}