package ua.nure.medirepairtrack.DTO.ClaimDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ClaimShortDTO {

    private Integer id;

    private String equipmentModel;
    private String serialNumber;

    private String defectDescription;

    private String repairType;
    private String status;

    private LocalDateTime createdAt;
}
