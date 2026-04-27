package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimEmployeeDTO.*;
import ua.nure.medirepairtrack.DTO.employee.EmployeeDTO.EmployeeShortDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.ClaimEmployee;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.ClaimEmployeeId;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;
import ua.nure.medirepairtrack.Event.ClaimEmployee.ClaimEmployeeAssignedEvent;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.claim.ClaimEmployeeRepository;
import ua.nure.medirepairtrack.Repository.claim.ClaimRepairOperationRepository;
import ua.nure.medirepairtrack.Repository.claim.ClaimRepository;
import ua.nure.medirepairtrack.Repository.employee.EmployeeRepository;
import ua.nure.medirepairtrack.Workflow.ClaimStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClaimEmployeeService {

    private final ClaimEmployeeRepository claimEmployeeRepository;
    private final ClaimRepairOperationRepository claimRepairOperationRepository;
    private final ClaimRepository claimRepository;
    private final EmployeeRepository employeeRepository;
    private final ClaimHistoryService claimHistoryService;
    private final ClaimStatusMachine claimStatusMachine;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ClaimEmployeeResponseDTO assignEmployee(Integer claimId, AssignEmployeeToClaimDTO dto) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        if (!claimStatusMachine.allowsAssignment(claim.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "призначити працівника",
                            claim.getStatus(),
                            claimStatusMachine.allowedClaimEditStatuses()
                    )
            );
        }

        validateCanManageEmployees(claimId, dto.getPerformedByEmployeeId());

        Employee employee = getEmployee(dto.getEmployeeId());
        ClaimEmployeeId id = new ClaimEmployeeId(claimId, dto.getEmployeeId());

        if (claimEmployeeRepository.existsByIdClaimIdAndIdEmployeeId(claimId, dto.getEmployeeId())) {
            throw new OperationNotAllowedException("Працівник вже призначений до заявки");
        }

        if (dto.getRole() == RoleInClaim.LEAD) {
            boolean leadExists = claimEmployeeRepository
                    .existsByClaimIdAndRoleInClaim(claimId, RoleInClaim.LEAD);

            if (leadExists) {
                throw new OperationNotAllowedException("У заявці вже є головний інженер");
            }
        }

        ClaimEmployee ce = ClaimEmployee.builder()
                .id(id)
                .claim(claim)
                .employee(employee)
                .roleInClaim(dto.getRole())
                .hoursWorked(BigDecimal.ZERO)
                .notes(dto.getNotes())
                .build();

        claimEmployeeRepository.save(ce);

        Employee performer = getEmployee(dto.getPerformedByEmployeeId());
        Employee target = employee;

        String description = String.format(
                "Працівник %s призначив %s з роллю %s",
                getShortName(performer),
                getShortName(target),
                roleLabel(dto.getRole())
        );

        eventPublisher.publishEvent(
                new ClaimEmployeeAssignedEvent(
                        claimId,
                        performer.getId(),
                        description
                )
        );

        return mapToResponse(ce);
    }

    @Transactional
    public ClaimEmployeeResponseDTO updateClaimEmployee(Integer claimId, Integer employeeId, UpdateClaimEmployeeDTO dto) {
        validateCanManageEmployees(claimId, dto.getPerformedByEmployeeId());

        ClaimEmployee claimEmployee = getClaimEmployee(claimId, employeeId);

        Claim claim = claimEmployee.getClaim();

        if (!claimStatusMachine.allowsAssignment(claim.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "змінити працівника в заявці",
                            claim.getStatus(),
                            claimStatusMachine.allowedClaimEditStatuses()
                    )
            );
        }

        RoleInClaim currentRole = claimEmployee.getRoleInClaim();
        RoleInClaim nextRole = dto.getRoleInClaim();
        String currentNotes = claimEmployee.getNotes();
        String nextNotes = dto.getNotes();

        if (dto.getPerformedByEmployeeId().equals(employeeId)
                && claimEmployee.getRoleInClaim() == RoleInClaim.LEAD
                && dto.getRoleInClaim() != RoleInClaim.LEAD
        ) {
            throw new OperationNotAllowedException("Головний інженер не може змінити власну роль");
        }

        if (nextRole == RoleInClaim.LEAD && currentRole != RoleInClaim.LEAD) {
            boolean leadExists = claimEmployeeRepository.existsByClaimIdAndRoleInClaim(claimId, RoleInClaim.LEAD);
            if (leadExists) {
                throw new OperationNotAllowedException("У заявці вже є головний інженер");
            }
        }

        boolean roleChanged = currentRole != nextRole;
        boolean notesChanged = !Objects.equals(currentNotes, nextNotes);

        if (!roleChanged && !notesChanged) {
            return mapToResponse(claimEmployee);
        }

        if (roleChanged) {
            claimEmployee.setRoleInClaim(nextRole);
        }

        if (notesChanged) {
            claimEmployee.setNotes(nextNotes);
        }

        claimEmployeeRepository.save(claimEmployee);

        if (roleChanged) {
            Employee performer = getEmployee(dto.getPerformedByEmployeeId());
            Employee target = claimEmployee.getEmployee();

            claimHistoryService.addSystemEvent(
                    claimId,
                    performer.getId(),
                    ActionType.SYSTEM_EVENT,
                    String.format(
                            "Працівник %s змінив роль %s з %s на %s",
                            getShortName(performer),
                            getShortName(target),
                            roleLabel(currentRole),
                            roleLabel(nextRole)
                    )
            );
        }

        return mapToResponse(claimEmployee);
    }

    @Transactional
    public void deleteClaimEmployee(Integer claimId, Integer employeeId, Integer performedByEmployeeId) {
        validateCanManageEmployees(claimId, performedByEmployeeId);

        ClaimEmployee claimEmployee = getClaimEmployee(claimId, employeeId);

        Claim claim = claimEmployee.getClaim();

        if (!claimStatusMachine.allowsAssignment(claim.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "видалити працівника із заявки",
                            claim.getStatus(),
                            claimStatusMachine.allowedClaimEditStatuses()
                    )
            );
        }

        if (performedByEmployeeId.equals(employeeId)) {
            throw new OperationNotAllowedException("Не можна видалити самого себе зі складу працівників заявки");
        }

        claimEmployeeRepository.delete(claimEmployee);

        Employee performer = getEmployee(performedByEmployeeId);
        Employee target = claimEmployee.getEmployee();

        claimHistoryService.addSystemEvent(
                claimId,
                performedByEmployeeId,
                ActionType.SYSTEM_EVENT,
                String.format(
                        "Працівник %s видалив %s зі складу заявки",
                        getShortName(performer),
                        getShortName(target)
                )
        );
    }

    public List<AssignedClaimDTO> getAssignedClaims(Integer employeeId) {
        return findAssignedClaims(employeeId, null)
                .stream()
                .map(this::mapToAssignedClaimDTO)
                .toList();
    }

    public List<AssignedActiveClaimViewDTO> getActiveAssignedClaims(Integer employeeId) {
        return findAssignedClaims(employeeId, claimStatusMachine.getActiveStatuses())
                .stream()
                .map(this::mapToAssignedActiveClaimViewDTO)
                .toList();
    }

    /**
     * Повертає призначення працівника до заявок.
     *
     * Якщо statuses == null або порожній — повертаються всі призначені заявки.
     * Якщо statuses задано — повертаються лише заявки з відповідними статусами.
     *
     * Це дозволяє використовувати один спільний метод для:
     * - повного списку призначених заявок;
     * - активних призначених заявок для робочого списку інженера.
     */
    private List<ClaimEmployee> findAssignedClaims(Integer employeeId, Set<Status> statuses) {
        if (statuses == null || statuses.isEmpty()) {
            return claimEmployeeRepository.findByEmployeeId(employeeId);
        }

        return claimEmployeeRepository.findByEmployeeIdAndClaim_StatusIn(employeeId, statuses);
    }

    public List<EmployeeShortDTO> getAssignableEmployees(Integer claimId, Integer performedByEmployeeId) {
        claimRepository.findById(claimId)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        validateCanManageEmployees(claimId, performedByEmployeeId);

        List<Employee> employees = employeeRepository.findAssignableEmployees(claimId, performedByEmployeeId);

        return employees.stream()
                .map(e -> EmployeeShortDTO.builder()
                        .id(e.getId())
                        .firstName(e.getUser().getFirstName())
                        .lastName(e.getUser().getLastName())
                        .position(e.getPosition())
                        .availabilityStatus(e.getAvailabilityStatus())
                        .build()
                )
                .toList();
    }

    public List<ClaimEmployeeResponseDTO> getEmployeesByClaim(Integer claimId) {
        return claimEmployeeRepository.findByClaimId(claimId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ClaimEmployee> getByClaim(Integer claimId) {
        return claimEmployeeRepository.findByClaimId(claimId);
    }

    @Transactional
    public void recalculateHours(Integer claimId, Integer employeeId) {

        claimEmployeeRepository.findByIdClaimIdAndIdEmployeeId(claimId, employeeId)
                .ifPresent(claimEmployee -> {
                    BigDecimal totalHours = claimRepairOperationRepository
                            .sumTimeSpentByClaimAndEmployee(claimId, employeeId);

                    claimEmployee.setHoursWorked(totalHours != null ? totalHours : BigDecimal.ZERO);
                    claimEmployeeRepository.save(claimEmployee);
                });
    }

    private void validateCanManageEmployees(Integer claimId, Integer performedByEmployeeId) {
        Employee performer = getEmployee(performedByEmployeeId);

        if (performer.getPosition() == Position.MANAGER || performer.getPosition() == Position.SYSTEM) {
            return;
        }

        ClaimEmployee ce = claimEmployeeRepository
                .findByIdClaimIdAndIdEmployeeId(claimId, performedByEmployeeId)
                .orElseThrow(() -> new OperationNotAllowedException("Ви не призначені до цієї заявки"));

        if (ce.getRoleInClaim() != RoleInClaim.LEAD) {
            throw new OperationNotAllowedException("Лише менеджер або головний інженер можуть керувати працівниками заявки");
        }
    }

    private AssignedClaimDTO mapToAssignedClaimDTO(ClaimEmployee ce) {
        return AssignedClaimDTO.builder()
                .claimId(ce.getClaim().getId())
                .status(ce.getClaim().getStatus())
                .role(ce.getRoleInClaim())
                .hoursWorked(ce.getHoursWorked())
                .build();
    }

    private AssignedActiveClaimViewDTO mapToAssignedActiveClaimViewDTO(ClaimEmployee ce) {
        Claim c = ce.getClaim();

        return AssignedActiveClaimViewDTO.builder()
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

    private ClaimEmployeeResponseDTO mapToResponse(ClaimEmployee ce) {
        return ClaimEmployeeResponseDTO.builder()
                .employeeId(ce.getEmployee().getId())
                .firstName(ce.getEmployee().getUser().getFirstName())
                .lastName(ce.getEmployee().getUser().getLastName())
                .position(ce.getEmployee().getPosition())
                .ratePerHour(ce.getEmployee().getRatePerHour())
                .roleInClaim(ce.getRoleInClaim())
                .hoursWorked(ce.getHoursWorked())
                .notes(ce.getNotes())
                .build();
    }

    private String getShortName(Employee e) {
        return String.format(
                "%s %s.",
                e.getUser().getLastName(),
                e.getUser().getFirstName()
        );
    }

    private String roleLabel(RoleInClaim role) {
        return switch (role) {
            case LEAD -> "головного інженера";
            case ASSISTANT -> "асистента";
            case DIAGNOSTIC -> "діагноста";
            case INSTALLER -> "монтажника";
            case EXPERT -> "експерта";
        };
    }

    private ClaimEmployee getClaimEmployee(Integer claimId, Integer employeeId) {
        return claimEmployeeRepository.findByIdClaimIdAndIdEmployeeId(claimId, employeeId)
                .orElseThrow(() -> new NotFoundException("Працівник не призначений до заявки"));
    }

    private Employee getEmployee(Integer employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new NotFoundException("Працівник не знайдений"));
    }
}

