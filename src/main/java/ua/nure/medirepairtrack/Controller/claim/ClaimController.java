package ua.nure.medirepairtrack.Controller.claim;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimDTO.*;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;
import ua.nure.medirepairtrack.Service.claim.ClaimService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/claim")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    // для клієнта
    @PostMapping("/client")
    public ClaimResponseDTO createByClient(@Valid @RequestBody CreateClaimDTO dto) {
        return claimService.create(dto);
    }

    // для працівника / адміна
    @PostMapping("/employee")
    public ClaimResponseDTO createByEmployee(@Valid @RequestBody CreateClaimByEmployeeDTO dto) {
        return claimService.createByEmployee(dto);
    }

    @PutMapping("/{id}")
    public ClaimResponseDTO updateDetails(@PathVariable Integer id, @Valid @RequestBody UpdateClaimDTO dto) {
        return claimService.updateDetails(id, dto);
    }

    @GetMapping("/{id}/allowed-statuses")
    public Set<Status> getAllowedStatuses(@PathVariable Integer id) {
        return claimService.getAllowedNextStatuses(id);
    }

    @PatchMapping("/{id}/status")
    public ClaimResponseDTO changeStatus(@PathVariable Integer id, @RequestParam Integer employeeId, @Valid @RequestBody UpdateClaimStatusDTO dto) {
        return claimService.changeStatus(id, employeeId, dto);
    }

    @GetMapping("/{id}")
    public ClaimResponseDTO getClaimById(@PathVariable Integer id) {
        return claimService.getClaimById(id);
    }

    @GetMapping("/client/{clientId}")
    public List<ClaimResponseDTO> getByClient(@PathVariable Integer clientId) {
        return claimService.getByClient(clientId);
    }

    @GetMapping("/active")
    public List<ClaimResponseDTO> getActiveClaims() {
        return claimService.getActiveClaims();
    }

    @GetMapping("/status/{status}")
    public List<ClaimResponseDTO> getByStatus(@PathVariable Status status) {
        return claimService.getByStatus(status);
    }

    @GetMapping
    public List<ClaimResponseDTO> getAllClaims() {
        return claimService.getAllClaims();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        claimService.delete(id);
    }
}
