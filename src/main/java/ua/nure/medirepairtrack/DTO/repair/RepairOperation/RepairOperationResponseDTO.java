package ua.nure.medirepairtrack.DTO.repair.RepairOperation;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RepairOperationResponseDTO {

    private Integer id;

    private Integer complexityLevelId;

    private String name;
    private String description;

    private Integer createdByEmployeeId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}