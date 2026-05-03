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
@RequestMapping("/api/claim-works/{claimWorkId}/parts")
@RequiredArgsConstructor
public class ClaimWorkPartController {

    private final ClaimWorkPartService service;

    @PostMapping
    public ClaimWorkPartResponseDTO addPart(@PathVariable Integer claimWorkId, @RequestParam Integer employeeId,
                                            @Valid @RequestBody CreateClaimWorkPartDTO dto) {
        return service.addPartToClaimWork(claimWorkId, employeeId, dto);
    }

    @PutMapping
    public ClaimWorkPartResponseDTO updateQuantity(@PathVariable Integer claimWorkId, @RequestParam Integer employeeId,
                                                   @Valid @RequestBody UpdateClaimWorkPartQuantityDTO dto) {
        return service.updateClaimWorkPartQuantity(claimWorkId, employeeId, dto);
    }

    @DeleteMapping("/{partId}")
    public void delete(@PathVariable Integer claimWorkId, @PathVariable Integer partId,
                       @RequestParam Integer employeeId) {
        service.deleteClaimWorkPart(claimWorkId, employeeId, partId);
    }

    @GetMapping
    public List<ClaimWorkPartResponseDTO> getAll(@PathVariable Integer claimWorkId) {
        return service.getPartsByClaimWork(claimWorkId);
    }
}
