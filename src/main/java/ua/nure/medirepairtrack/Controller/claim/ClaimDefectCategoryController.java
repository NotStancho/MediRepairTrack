package ua.nure.medirepairtrack.Controller.claim;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimDefectCategory.ClaimDefectCategoryResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimDefectCategory.CreateClaimDefectCategoryDTO;
import ua.nure.medirepairtrack.Service.claim.ClaimDefectCategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/claim-defect-category")
@RequiredArgsConstructor
public class ClaimDefectCategoryController {

    private final ClaimDefectCategoryService service;

    @PostMapping
    public ClaimDefectCategoryResponseDTO create(@Valid @RequestBody CreateClaimDefectCategoryDTO dto) {
        return service.create(dto);
    }

    @DeleteMapping("/claim/{claimId}/defect/{defectCategoryId}")
    public void delete(@PathVariable Integer claimId, @PathVariable Integer defectCategoryId) {
        service.delete(claimId, defectCategoryId);
    }

    @GetMapping("/claim/{claimId}")
    public List<ClaimDefectCategoryResponseDTO> getByClaim(@PathVariable Integer claimId) {
        return service.getByClaim(claimId);
    }
}