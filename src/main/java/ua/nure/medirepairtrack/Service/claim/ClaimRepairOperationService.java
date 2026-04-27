package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.ClaimRepairOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.CreateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.UpdateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.ClaimRepairOperation.ClaimRepairOperation;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.repair.RepairOperation.RepairOperation;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationUpdatedEvent;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.claim.ClaimRepairOperationRepository;
import ua.nure.medirepairtrack.Service.employee.EmployeeService;
import ua.nure.medirepairtrack.Service.repair.RepairOperationService;
import ua.nure.medirepairtrack.Workflow.ClaimStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimRepairOperationService {

    private final ClaimRepairOperationRepository repository;

    private final ClaimService claimService;
    private final RepairOperationService repairOperationService;
    private final EmployeeService employeeService;
    private final ClaimStatusMachine claimStatusMachine;
    private final ClaimAccessService accessService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ClaimRepairOperationResponseDTO create(CreateClaimRepairOperationDTO dto) {

        Claim claim = claimService.getClaim(dto.getClaimId());
        RepairOperation operation = repairOperationService.getOperationEntity(dto.getOperationId());
        Employee employee = employeeService.getEmployeeEntity(dto.getEmployeeId());

        validateCanManageOperation(claim, employee.getId(), "додати ремонтну роботу");

        ClaimRepairOperation entity = ClaimRepairOperation.builder()
                .claim(claim)
                .operation(operation)
                .employee(employee)
                .timeSpent(dto.getTimeSpent())
                .note(dto.getNote())
                .createdAt(LocalDateTime.now())
                .build();

        ClaimRepairOperation saved = repository.save(entity);

        eventPublisher.publishEvent(new ClaimRepairOperationCreatedEvent(
                saved.getClaim().getId(),
                saved.getId(),
                saved.getEmployee().getId(),
                getEmployeeDisplayName(saved.getEmployee()),
                saved.getOperation().getId(),
                saved.getOperation().getName(),
                saved.getTimeSpent()
        ));

        return map(saved);
    }

    @Transactional
    public ClaimRepairOperationResponseDTO update(Integer id, UpdateClaimRepairOperationDTO dto) {

        ClaimRepairOperation entity = getEntity(id);

        validateCanManageOperation(entity.getClaim(), entity.getEmployee().getId(), "змінити ремонтну роботу");

        Integer oldRepairOperationId = entity.getOperation().getId();
        String oldRepairOperationName = entity.getOperation().getName();
        BigDecimal oldTimeSpent = entity.getTimeSpent();

        RepairOperation operation = repairOperationService.getOperationEntity(dto.getOperationId());

        entity.setOperation(operation);
        entity.setTimeSpent(dto.getTimeSpent());
        entity.setNote(dto.getNote());
        entity.setUpdatedAt(LocalDateTime.now());

        ClaimRepairOperation saved = repository.save(entity);

        eventPublisher.publishEvent(new ClaimRepairOperationUpdatedEvent(
                saved.getClaim().getId(),
                saved.getId(),
                saved.getEmployee().getId(),
                getEmployeeDisplayName(saved.getEmployee()),
                oldRepairOperationId,
                oldRepairOperationName,
                saved.getOperation().getId(),
                saved.getOperation().getName(),
                oldTimeSpent,
                saved.getTimeSpent()
        ));

        return map(saved);
    }

    public List<ClaimRepairOperationResponseDTO> getByClaim(Integer claimId) {

        return repository.findByClaimIdOrderByCreatedAt(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Transactional
    public void delete(Integer id) {

        ClaimRepairOperation entity = getEntity(id);

        validateCanManageOperation(entity.getClaim(), entity.getEmployee().getId(), "видалити ремонтну роботу");

        ClaimRepairOperationDeletedEvent event = new ClaimRepairOperationDeletedEvent(
                entity.getClaim().getId(),
                entity.getId(),
                entity.getEmployee().getId(),
                getEmployeeDisplayName(entity.getEmployee()),
                entity.getOperation().getId(),
                entity.getOperation().getName(),
                entity.getTimeSpent()
        );

        repository.delete(entity);
        eventPublisher.publishEvent(event);
    }

    public List<ClaimRepairOperation> getClaimOperations(Integer claimId) {

        return repository.findByClaimIdOrderByCreatedAt(claimId);
    }

    public ClaimRepairOperation getEntity(Integer id) {

        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запис операції ремонту не знайдено"));
    }

    private void validateCanManageOperation(Claim claim, Integer employeeId, String action) {
        if (!claimStatusMachine.allowsWorkLog(claim.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(action, claim.getStatus(), claimStatusMachine.allowedWorkLogStatuses())
            );
        }

        accessService.checkEmployeeCanWork(claim.getId(), employeeId);
    }

    private ClaimRepairOperationResponseDTO map(ClaimRepairOperation e) {

        return ClaimRepairOperationResponseDTO.builder()
                .id(e.getId())
                .claimId(e.getClaim().getId())
                .operationId(e.getOperation().getId())
                .employeeId(e.getEmployee().getId())
                .timeSpent(e.getTimeSpent())
                .note(e.getNote())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private String getEmployeeDisplayName(Employee employee) {
        return String.format(
                "%s %s.",
                employee.getUser().getLastName(),
                employee.getUser().getFirstName()
        );
    }
}