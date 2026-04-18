package ua.nure.medirepairtrack.DTO.claim.ClaimDefectCategory;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateClaimDefectCategoryDTO {

    @NotNull(message = "ID заявки є обов'язковим")
    private Integer claimId;

    @NotNull(message = "ID категорії дефекту є обов'язковим")
    private Integer defectCategoryId;

    @NotNull(message = "ID інженера є обов'язковим")
    private Integer employeeId;

}