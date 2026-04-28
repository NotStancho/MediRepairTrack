package ua.nure.medirepairtrack.Controller.claim;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.ClaimRepairOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.CreateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.UpdateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.UpdateClaimRepairOperationNoteDTO;
import ua.nure.medirepairtrack.Service.claim.ClaimRepairOperationService;

import java.util.List;

@RestController
@RequestMapping("/api/claim-repair-operations")
@RequiredArgsConstructor
public class ClaimRepairOperationController {

    private final ClaimRepairOperationService service;

    @PostMapping
    public ClaimRepairOperationResponseDTO create(@Valid @RequestBody CreateClaimRepairOperationDTO dto, @RequestParam Integer performedByEmployeeId) {
        return service.create(dto, performedByEmployeeId);
    }

    @PutMapping("/{id}")
    public ClaimRepairOperationResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateClaimRepairOperationDTO dto, @RequestParam Integer performedByEmployeeId) {
        return service.update(id, dto, performedByEmployeeId);
    }

    @PatchMapping("/{id}/note")
    public ClaimRepairOperationResponseDTO updateNote(@PathVariable Integer id, @Valid @RequestBody UpdateClaimRepairOperationNoteDTO dto, @RequestParam Integer performedByEmployeeId) {
        return service.updateNote(id, dto, performedByEmployeeId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam Integer performedByEmployeeId) {
        service.delete(id, performedByEmployeeId);
    }

    @GetMapping("/claim/{claimId}")
    public List<ClaimRepairOperationResponseDTO> getByClaim(@PathVariable Integer claimId) {
        return service.getByClaim(claimId);
    }

}
