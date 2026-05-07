package ua.nure.medirepairtrack.Controller.claim;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO.ClaimWorkPartResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO.CreateClaimWorkPartDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO.UpdateClaimWorkPartQuantityDTO;
import ua.nure.medirepairtrack.Service.claim.ClaimWorkPartService;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ClaimWorkPartController {

    private final ClaimWorkPartService service;

    @PostMapping("/claim-works/{claimWorkId}/parts")
    public ClaimWorkPartResponseDTO addPart(@PathVariable Integer claimWorkId, @RequestParam Integer employeeId,
                                            @Valid @RequestBody CreateClaimWorkPartDTO dto) {
        return service.addPartToClaimWork(claimWorkId, employeeId, dto);
    }

    @PutMapping("/claim-works/{claimWorkId}/parts")
    public ClaimWorkPartResponseDTO updateQuantity(@PathVariable Integer claimWorkId, @RequestParam Integer employeeId,
                                                   @Valid @RequestBody UpdateClaimWorkPartQuantityDTO dto) {
        return service.updateClaimWorkPartQuantity(claimWorkId, employeeId, dto);
    }

    @DeleteMapping("/claim-works/{claimWorkId}/parts/{partId}")
    public void delete(@PathVariable Integer claimWorkId, @PathVariable Integer partId,
                       @RequestParam Integer employeeId) {
        service.deleteClaimWorkPart(claimWorkId, employeeId, partId);
    }

    @GetMapping("/claim-works/{claimWorkId}/parts")
    public List<ClaimWorkPartResponseDTO> getAll(@PathVariable Integer claimWorkId) {
        return service.getPartsByClaimWork(claimWorkId);
    }

    @GetMapping("/claims/{claimId}/parts")
    public List<ClaimWorkPartResponseDTO> getAllByClaim(@PathVariable Integer claimId) {
        return service.getPartsByClaim(claimId);
    }
}
