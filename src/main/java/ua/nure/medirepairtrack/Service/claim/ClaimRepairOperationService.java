package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.ClaimRepairOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.CreateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.UpdateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimRepairOperationDTO.UpdateClaimRepairOperationNoteDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.ClaimRepairOperation.ClaimRepairOperation;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.repair.RepairOperation.RepairOperation;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationNoteUpdatedEvent;
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
import java.util.Objects;

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
    public ClaimRepairOperationResponseDTO create(CreateClaimRepairOperationDTO dto, Integer performedByEmployeeId) {

        Claim claim = claimService.getClaim(dto.getClaimId());
        RepairOperation operation = repairOperationService.getOperationEntity(dto.getOperationId());
        Employee employee = employeeService.getEmployeeEntity(dto.getEmployeeId());

        validateClaimStatusAllowsWork(claim, "додати ремонтну роботу");
        accessService.validateEmployeeCanWorkOnClaim(claim.getId(), performedByEmployeeId);

        if (!dto.getEmployeeId().equals(performedByEmployeeId)) {
            throw new OperationNotAllowedException("Можна додавати тільки власну ремонтну роботу");
        }

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
    public ClaimRepairOperationResponseDTO update(Integer id, UpdateClaimRepairOperationDTO dto, Integer performedByEmployeeId) {

        ClaimRepairOperation entity = getEntity(id);

        validateClaimStatusAllowsWork(entity.getClaim(), "змінити ремонтну роботу");
        accessService.validateEmployeeCanWorkOnClaim(entity.getClaim().getId(), performedByEmployeeId);

        if (!entity.getEmployee().getId().equals(performedByEmployeeId)) {
            throw new OperationNotAllowedException("Можна редагувати тільки власні записи ремонтних робіт");
        }

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

    @Transactional
    public ClaimRepairOperationResponseDTO updateNote(Integer id, UpdateClaimRepairOperationNoteDTO dto, Integer performedByEmployeeId) {

        ClaimRepairOperation entity = getEntity(id);

        validateClaimStatusAllowsWork(entity.getClaim(), "змінити примітку ремонтної роботи");
        accessService.validateEmployeeCanWorkOnClaim(entity.getClaim().getId(), performedByEmployeeId);

        boolean isOwn = entity.getEmployee().getId().equals(performedByEmployeeId);
        boolean isLead = accessService.isLeadOnClaim(entity.getClaim().getId(), performedByEmployeeId);

        if (!isOwn && !isLead) {
            throw new OperationNotAllowedException("Можна змінювати тільки власні записи або бути головним інженером");
        }

        String oldNote = entity.getNote();
        if (Objects.equals(entity.getNote(), dto.getNote())) {
            return map(entity);
        }

        Employee performedByEmployee = employeeService.getEmployeeEntity(performedByEmployeeId);

        entity.setNote(dto.getNote());
        entity.setUpdatedAt(LocalDateTime.now());

        ClaimRepairOperation saved = repository.save(entity);

        eventPublisher.publishEvent(new ClaimRepairOperationNoteUpdatedEvent(
                saved.getClaim().getId(),
                saved.getId(),
                saved.getEmployee().getId(),
                getEmployeeDisplayName(saved.getEmployee()),
                performedByEmployee.getId(),
                getEmployeeDisplayName(performedByEmployee),
                saved.getOperation().getId(),
                saved.getOperation().getName(),
                oldNote,
                saved.getNote()
        ));

        return map(saved);
    }

    @Transactional
    public void delete(Integer id, Integer performedByEmployeeId) {

        ClaimRepairOperation entity = getEntity(id);

        validateClaimStatusAllowsWork(entity.getClaim(), "видалити ремонтну роботу");
        accessService.validateEmployeeCanWorkOnClaim(entity.getClaim().getId(), performedByEmployeeId);

        if (!entity.getEmployee().getId().equals(performedByEmployeeId)) {
            throw new OperationNotAllowedException("Можна видаляти тільки власні записи ремонтних робіт");
        }

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

    public List<ClaimRepairOperationResponseDTO> getByClaim(Integer claimId) {

        return repository.findByClaimIdOrderByCreatedAt(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    public List<ClaimRepairOperation> getClaimOperations(Integer claimId) {

        return repository.findByClaimIdOrderByCreatedAt(claimId);
    }

    public ClaimRepairOperation getEntity(Integer id) {

        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запис операції ремонту не знайдено"));
    }

    private void validateClaimStatusAllowsWork(Claim claim, String action) {
        if (!claimStatusMachine.allowsWork(claim.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(action, claim.getStatus(), claimStatusMachine.allowedWorkStatuses())
            );
        }
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
                "%s %s",
                employee.getUser().getLastName(),
                employee.getUser().getFirstName()
        );
    }
}
