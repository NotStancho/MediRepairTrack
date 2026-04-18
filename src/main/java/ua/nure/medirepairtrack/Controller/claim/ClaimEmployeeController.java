package ua.nure.medirepairtrack.Controller.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.AssignedActiveClaimDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.AssignedClaimDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.ClaimEmployeeResponseDTO;
import ua.nure.medirepairtrack.Service.claim.ClaimEmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/claim-employee")
@RequiredArgsConstructor
public class ClaimEmployeeController {

    private final ClaimEmployeeService claimEmployeeService;

    @GetMapping("/{employeeId}/claims")
    public List<AssignedClaimDTO> getAssignedClaims(@PathVariable Integer employeeId) {
        return claimEmployeeService.getAssignedClaims(employeeId);
    }

    @GetMapping("/{employeeId}/claims/active")
    public List<AssignedActiveClaimDTO> getActiveAssignedClaims(@PathVariable Integer employeeId) {
        return claimEmployeeService.getActiveAssignedClaims(employeeId);
    }

    @GetMapping("/{claimId}/employees")
    public List<ClaimEmployeeResponseDTO> getEmployeesByClaim(@PathVariable Integer claimId){
        return claimEmployeeService.getEmployeesByClaim(claimId);
    }
}
