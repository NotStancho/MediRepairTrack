package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.AssignedActiveClaimDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.AssignedClaimDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.ClaimEmployeeResponseDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.ClaimEmployee;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.ClaimEmployeeId;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;
import ua.nure.medirepairtrack.Repository.claim.ClaimEmployeeRepository;
import ua.nure.medirepairtrack.Repository.claim.ClaimHistoryRepository;
import ua.nure.medirepairtrack.Repository.claim.ClaimRepository;
import ua.nure.medirepairtrack.Repository.employee.EmployeeRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimEmployeeService {

    private final ClaimEmployeeRepository claimEmployeeRepository;
    private final ClaimHistoryRepository claimHistoryRepository;
    private final ClaimRepository claimRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public void assignEmployee(Claim claim, Integer employeeId, RoleInClaim role) {
        ClaimEmployeeId id = new ClaimEmployeeId(claim.getId(), employeeId);

        if (claimEmployeeRepository.existsByIdClaimIdAndIdEmployeeId(claim.getId(), employeeId)) {
            throw new IllegalStateException("Працівник вже призначений до заявки");
        }

        ClaimEmployee ce = ClaimEmployee.builder()
                .id(id)
                .claim(claim)
                .employee(employeeRepository.getReferenceById(employeeId))
                .roleInClaim(role)
                .hoursWorked(BigDecimal.ZERO)
                .build();

        claimEmployeeRepository.save(ce);
    }

    public List<AssignedClaimDTO> getAssignedClaims(Integer employeeId) {
        return claimEmployeeRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToAssignedClaimDTO)
                .toList();
    }

    public List<AssignedActiveClaimDTO> getActiveAssignedClaims(Integer employeeId) {
        return claimEmployeeRepository
                .findByEmployeeIdAndClaim_ClosedAtIsNull(employeeId)
                .stream()
                .map(this::mapToAssignedActiveClaimDTO)
                .toList();
    }

    @Transactional
    public void recalculateHours(Integer claimId, Integer employeeId) {

        BigDecimal totalHours =
                claimHistoryRepository.sumWorkLogTimeByEmployee(
                        claimId, employeeId
                );

        ClaimEmployeeId id = new ClaimEmployeeId(claimId, employeeId);

        ClaimEmployee ce = claimEmployeeRepository.findById(id)
                .orElseGet(() -> ClaimEmployee.builder()
                        .id(id)
                        .claim(claimRepository.getReferenceById(claimId))
                        .employee(employeeRepository.getReferenceById(employeeId))
                        .roleInClaim(RoleInClaim.ASSISTANT) // default
                        .hoursWorked(BigDecimal.ZERO)
                        .build()
                );

        ce.setHoursWorked(totalHours != null ? totalHours : BigDecimal.ZERO);

        claimEmployeeRepository.save(ce);
    }

    public List<ClaimEmployeeResponseDTO> getEmployeesByClaim(Integer claimId) {
        return claimEmployeeRepository.findByClaimId(claimId)
                .stream()
                .map(ce -> ClaimEmployeeResponseDTO.builder()
                        .employeeId(ce.getEmployee().getId())
                        .firstName(ce.getEmployee().getUser().getFirstName())
                        .lastName(ce.getEmployee().getUser().getLastName())
                        .position(ce.getEmployee().getPosition())
                        .roleInClaim(ce.getRoleInClaim())
                        .hoursWorked(ce.getHoursWorked())
                        .notes(ce.getNotes())
                        .build()
                )
                .toList();
    }

    public List<ClaimEmployee> getByClaim(Integer claimId) {
        return claimEmployeeRepository.findByClaimId(claimId);
    }

    private AssignedClaimDTO mapToAssignedClaimDTO(ClaimEmployee ce) {
        return AssignedClaimDTO.builder()
                .claimId(ce.getClaim().getId())
                .status(ce.getClaim().getStatus())
                .role(ce.getRoleInClaim())
                .hoursWorked(ce.getHoursWorked())
                .build();
    }

    private AssignedActiveClaimDTO mapToAssignedActiveClaimDTO(ClaimEmployee ce) {
        Claim c = ce.getClaim();

        return AssignedActiveClaimDTO.builder()
                .claimId(c.getId())
                .clientId(c.getClient().getId())
                .status(c.getStatus())
                .repairType(c.getRepairType())
                .role(ce.getRoleInClaim())
                .hoursWorked(ce.getHoursWorked())
                .totalTimeSpent(c.getTotalTimeSpent())
                .createdAt(c.getCreatedAt())
                .closedAt(c.getClosedAt())
                .defectDescription(c.getDefectDescription())
                .build();
    }
}

