package ua.nure.medirepairtrack.DTO.claim.ClaimDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
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
