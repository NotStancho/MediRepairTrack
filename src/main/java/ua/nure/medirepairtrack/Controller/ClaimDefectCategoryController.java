package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.ClaimDefectCategory.*;
import ua.nure.medirepairtrack.Service.ClaimDefectCategoryService;

@RestController
@RequestMapping("/api/claim-defect-category")
@RequiredArgsConstructor
public class ClaimDefectCategoryController {

    private final ClaimDefectCategoryService service;

    @PostMapping
    public ClaimDefectCategoryResponseDTO create(@Valid @RequestBody CreateClaimDefectCategoryDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/claim/{claimId}")
    public ClaimDefectCategoryResponseDTO update(@PathVariable Integer claimId, @Valid @RequestBody UpdateClaimDefectCategoryDTO dto) {
        return service.update(claimId, dto);
    }

    @DeleteMapping("/claim/{claimId}")
    public void delete(@PathVariable Integer claimId) {
        service.delete(claimId);
    }
}