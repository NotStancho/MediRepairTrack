package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.ClaimRepairOperation.ClaimRepairOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.ClaimRepairOperation.CreateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.ClaimRepairOperation.UpdateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.Service.ClaimRepairOperationService;

import java.util.List;

@RestController
@RequestMapping("/api/claim-repair-operations")
@RequiredArgsConstructor
public class ClaimRepairOperationController {

    private final ClaimRepairOperationService service;

    @PostMapping
    public ClaimRepairOperationResponseDTO create(@Valid @RequestBody CreateClaimRepairOperationDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ClaimRepairOperationResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateClaimRepairOperationDTO dto) {
        return service.update(id, dto);
    }

    @GetMapping("/claim/{claimId}")
    public List<ClaimRepairOperationResponseDTO> getByClaim(@PathVariable Integer claimId) {
        return service.getByClaim(claimId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

}
