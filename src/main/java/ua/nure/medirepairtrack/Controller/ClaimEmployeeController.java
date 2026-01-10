package ua.nure.medirepairtrack.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.ClaimEmployeeDTO.*;
import ua.nure.medirepairtrack.Service.ClaimEmployeeService;

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
