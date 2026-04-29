package ua.nure.medirepairtrack.DTO.repair.RepairWork;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RepairWorkResponseDTO {

    private Integer id;

    private Integer complexityLevelId;

    private String name;
    private String description;

    private Integer createdByEmployeeId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}