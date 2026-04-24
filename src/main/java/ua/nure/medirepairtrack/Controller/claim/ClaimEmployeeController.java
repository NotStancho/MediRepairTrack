package ua.nure.medirepairtrack.Controller.claim;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.AssignEmployeeToClaimDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.AssignedActiveClaimViewDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.AssignedClaimDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.ClaimEmployeeResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.UpdateClaimEmployeeDTO;
import ua.nure.medirepairtrack.DTO.employee.EmployeeDTO.EmployeeShortDTO;
import ua.nure.medirepairtrack.Service.claim.ClaimEmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/claim-employee")
@RequiredArgsConstructor
public class ClaimEmployeeController {

    private final ClaimEmployeeService claimEmployeeService;

    @PostMapping("/{claimId}/employees")
    public ClaimEmployeeResponseDTO assignEmployee(@PathVariable Integer claimId, @Valid @RequestBody AssignEmployeeToClaimDTO dto) {
        return claimEmployeeService.assignEmployee(claimId, dto);
    }

    @PutMapping("/{claimId}/employees/{employeeId}")
    public ClaimEmployeeResponseDTO updateClaimEmployee(@PathVariable Integer claimId, @PathVariable Integer employeeId,
                                                        @Valid @RequestBody UpdateClaimEmployeeDTO dto) {
        return claimEmployeeService.updateClaimEmployee(claimId, employeeId, dto);
    }

    @DeleteMapping("/{claimId}/employees/{employeeId}")
    public void deleteClaimEmployee(@PathVariable Integer claimId, @PathVariable Integer employeeId,
                                    @RequestParam Integer performedByEmployeeId) {
        claimEmployeeService.deleteClaimEmployee(claimId, employeeId, performedByEmployeeId);
    }

    @GetMapping("/{employeeId}/claims")
    public List<AssignedClaimDTO> getAssignedClaims(@PathVariable Integer employeeId) {
        return claimEmployeeService.getAssignedClaims(employeeId);
    }

    @GetMapping("/{employeeId}/claims/active")
    public List<AssignedActiveClaimViewDTO> getActiveAssignedClaims(@PathVariable Integer employeeId) {
        return claimEmployeeService.getActiveAssignedClaims(employeeId);
    }

    @GetMapping("/{claimId}/employees")
    public List<ClaimEmployeeResponseDTO> getEmployeesByClaim(@PathVariable Integer claimId){
        return claimEmployeeService.getEmployeesByClaim(claimId);
    }

    @GetMapping("/{claimId}/assignable-employees")
    public List<EmployeeShortDTO> getAssignableEmployees(@PathVariable Integer claimId, @RequestParam Integer performedByEmployeeId) {
        return claimEmployeeService.getAssignableEmployees(claimId, performedByEmployeeId);
    }
}
