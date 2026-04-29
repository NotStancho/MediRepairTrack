package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO.ClaimWorkResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO.CreateClaimWorkDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO.UpdateClaimWorkDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkDTO.UpdateClaimWorkNoteDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.ClaimWork.ClaimWork;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.repair.RepairWork.RepairWork;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkNoteUpdatedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkUpdatedEvent;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.claim.ClaimWorkRepository;
import ua.nure.medirepairtrack.Service.employee.EmployeeService;
import ua.nure.medirepairtrack.Service.repair.RepairWorkService;
import ua.nure.medirepairtrack.Workflow.ClaimStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ClaimWorkService {

    private final ClaimWorkRepository repository;

    private final ClaimService claimService;
    private final RepairWorkService repairWorkService;
    private final EmployeeService employeeService;
    private final ClaimStatusMachine claimStatusMachine;
    private final ClaimAccessService accessService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ClaimWorkResponseDTO create(CreateClaimWorkDTO dto, Integer performedByEmployeeId) {

        Claim claim = claimService.getClaim(dto.getClaimId());
        RepairWork repairWork = repairWorkService.getEntity(dto.getRepairWorkId());
        Employee employee = employeeService.getEmployeeEntity(dto.getEmployeeId());

        validateClaimStatusAllowsWork(claim, "додати ремонтну роботу");
        accessService.validateEmployeeCanWorkOnClaim(claim.getId(), performedByEmployeeId);

        if (!dto.getEmployeeId().equals(performedByEmployeeId)) {
            throw new OperationNotAllowedException("Можна додавати тільки власну ремонтну роботу");
        }

        ClaimWork entity = ClaimWork.builder()
                .claim(claim)
                .repairWork(repairWork)
                .employee(employee)
                .timeSpent(dto.getTimeSpent())
                .note(dto.getNote())
                .createdAt(LocalDateTime.now())
                .build();

        ClaimWork saved = repository.save(entity);

        eventPublisher.publishEvent(new ClaimWorkCreatedEvent(
                saved.getClaim().getId(),
                saved.getId(),
                saved.getEmployee().getId(),
                getEmployeeDisplayName(saved.getEmployee()),
                saved.getRepairWork().getId(),
                saved.getRepairWork().getName(),
                saved.getTimeSpent()
        ));

        return map(saved);
    }

    @Transactional
    public ClaimWorkResponseDTO update(Integer id, UpdateClaimWorkDTO dto, Integer performedByEmployeeId) {

        ClaimWork entity = getEntity(id);

        validateClaimStatusAllowsWork(entity.getClaim(), "змінити ремонтну роботу");
        accessService.validateEmployeeCanWorkOnClaim(entity.getClaim().getId(), performedByEmployeeId);

        if (!entity.getEmployee().getId().equals(performedByEmployeeId)) {
            throw new OperationNotAllowedException("Можна редагувати тільки власні записи ремонтних робіт");
        }

        Integer oldRepairWorkId = entity.getRepairWork().getId();
        String oldRepairWorkName = entity.getRepairWork().getName();
        BigDecimal oldTimeSpent = entity.getTimeSpent();

        RepairWork repairWork = repairWorkService.getEntity(dto.getRepairWorkId());

        entity.setRepairWork(repairWork);
        entity.setTimeSpent(dto.getTimeSpent());
        entity.setNote(dto.getNote());
        entity.setUpdatedAt(LocalDateTime.now());

        ClaimWork saved = repository.save(entity);

        eventPublisher.publishEvent(new ClaimWorkUpdatedEvent(
                saved.getClaim().getId(),
                saved.getId(),
                saved.getEmployee().getId(),
                getEmployeeDisplayName(saved.getEmployee()),
                oldRepairWorkId,
                oldRepairWorkName,
                saved.getRepairWork().getId(),
                saved.getRepairWork().getName(),
                oldTimeSpent,
                saved.getTimeSpent()
        ));

        return map(saved);
    }

    @Transactional
    public ClaimWorkResponseDTO updateNote(Integer id, UpdateClaimWorkNoteDTO dto, Integer performedByEmployeeId) {

        ClaimWork entity = getEntity(id);

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

        ClaimWork saved = repository.save(entity);

        eventPublisher.publishEvent(new ClaimWorkNoteUpdatedEvent(
                saved.getClaim().getId(),
                saved.getId(),
                saved.getEmployee().getId(),
                getEmployeeDisplayName(saved.getEmployee()),
                performedByEmployee.getId(),
                getEmployeeDisplayName(performedByEmployee),
                saved.getRepairWork().getId(),
                saved.getRepairWork().getName(),
                oldNote,
                saved.getNote()
        ));

        return map(saved);
    }

    @Transactional
    public void delete(Integer id, Integer performedByEmployeeId) {

        ClaimWork entity = getEntity(id);

        validateClaimStatusAllowsWork(entity.getClaim(), "видалити ремонтну роботу");
        accessService.validateEmployeeCanWorkOnClaim(entity.getClaim().getId(), performedByEmployeeId);

        if (!entity.getEmployee().getId().equals(performedByEmployeeId)) {
            throw new OperationNotAllowedException("Можна видаляти тільки власні записи ремонтних робіт");
        }

        ClaimWorkDeletedEvent event = new ClaimWorkDeletedEvent(
                entity.getClaim().getId(),
                entity.getId(),
                entity.getEmployee().getId(),
                getEmployeeDisplayName(entity.getEmployee()),
                entity.getRepairWork().getId(),
                entity.getRepairWork().getName(),
                entity.getTimeSpent()
        );

        repository.delete(entity);
        eventPublisher.publishEvent(event);
    }

    public List<ClaimWorkResponseDTO> getByClaim(Integer claimId) {

        return repository.findByClaimIdOrderByCreatedAt(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    public List<ClaimWork> getClaimWorks(Integer claimId) {

        return repository.findByClaimIdOrderByCreatedAt(claimId);
    }

    public ClaimWork getEntity(Integer id) {

        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запис ремонтної роботи не знайдено"));
    }

    private void validateClaimStatusAllowsWork(Claim claim, String action) {
        if (!claimStatusMachine.allowsWork(claim.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(action, claim.getStatus(), claimStatusMachine.allowedWorkStatuses())
            );
        }
    }

    private ClaimWorkResponseDTO map(ClaimWork e) {

        return ClaimWorkResponseDTO.builder()
                .id(e.getId())
                .claimId(e.getClaim().getId())
                .repairWorkId(e.getRepairWork().getId())
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
