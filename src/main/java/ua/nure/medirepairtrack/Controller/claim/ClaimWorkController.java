package ua.nure.medirepairtrack.Controller.claim;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO.ClaimWorkResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO.CreateClaimWorkDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO.UpdateClaimWorkDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO.UpdateClaimWorkNoteDTO;
import ua.nure.medirepairtrack.Service.claim.ClaimWorkService;

import java.util.List;

@RestController
@RequestMapping("/api/claim-works")
@RequiredArgsConstructor
public class ClaimWorkController {

    private final ClaimWorkService service;

    @PostMapping
    public ClaimWorkResponseDTO create(@Valid @RequestBody CreateClaimWorkDTO dto, @RequestParam Integer performedByEmployeeId) {
        return service.create(dto, performedByEmployeeId);
    }

    @PutMapping("/{id}")
    public ClaimWorkResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateClaimWorkDTO dto, @RequestParam Integer performedByEmployeeId) {
        return service.update(id, dto, performedByEmployeeId);
    }

    @PatchMapping("/{id}/note")
    public ClaimWorkResponseDTO updateNote(@PathVariable Integer id, @Valid @RequestBody UpdateClaimWorkNoteDTO dto, @RequestParam Integer performedByEmployeeId) {
        return service.updateNote(id, dto, performedByEmployeeId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam Integer performedByEmployeeId) {
        service.delete(id, performedByEmployeeId);
    }

    @GetMapping("/claim/{claimId}")
    public List<ClaimWorkResponseDTO> getByClaim(@PathVariable Integer claimId) {
        return service.getByClaim(claimId);
    }

}
