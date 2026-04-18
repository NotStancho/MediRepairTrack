package ua.nure.medirepairtrack.DTO.claim.ClaimDefectCategory;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateClaimDefectCategoryDTO {

    @NotNull(message = "ID нової категорії дефекту є обов'язковим")
    private Integer defectCategoryId;

    @NotNull(message = "ID інженера є обов'язковим")
    private Integer employeeId;

}