package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.Repository.ClaimHistoryRepository;
import ua.nure.medirepairtrack.Repository.ClaimRepository;
import ua.nure.medirepairtrack.Repository.EmployeeRepository;
import ua.nure.medirepairtrack.DTO.ClaimHistoryDTO.*;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.ClaimHistory.*;
import ua.nure.medirepairtrack.Entity.Employee.Employee;
import ua.nure.medirepairtrack.Event.ClaimHistory.*;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Workflow.ClaimStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimHistoryService {

    private final ClaimHistoryRepository claimHistoryRepository;
    private final ClaimRepository claimRepository;
    private final EmployeeRepository employeeRepository;

    private final ApplicationEventPublisher eventPublisher;

    private final ClaimStatusMachine claimStatusMachine;
    private final ClaimAccessService accessService;

    // =========================
    // ADD WORK LOG
    // =========================
    @Transactional
    public ClaimHistoryResponseDTO addWorkLog(CreateWorkLogDTO dto) {
        Claim claim = claimRepository.findById(dto.getClaimId())
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        // 1. статус заявки
        if (!claimStatusMachine.allowsWorkLog(claim.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("додати work log", claim.getStatus(), claimStatusMachine.allowedWorkLogStatuses())
            );
        }

        // 2. Доступ працівника
        accessService.checkEmployeeCanWork(dto.getClaimId(), dto.getEmployeeId());

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new NotFoundException("Працівник не знайдений"));

        ClaimHistory history = ClaimHistory.builder()
                .claim(claim)
                .employee(employee)
                .actionType(ActionType.WORK_LOG)
                .actionDescription(dto.getDescription())
                .timeSpent(dto.getHours())
                .actionDate(LocalDateTime.now())
                .build();

        claimHistoryRepository.save(history);

        recalcClaimTotalTime(claim.getId());

        eventPublisher.publishEvent(
                new WorkLogAddedEvent(
                        dto.getClaimId(),
                        dto.getEmployeeId()
                )
        );

        return map(history);
    }

    // =========================
    // UPDATE WORK LOG
    // =========================
    @Transactional
    public ClaimHistoryResponseDTO updateWorkLog(Integer workLogId, UpdateWorkLogDTO dto) {

        ClaimHistory history = claimHistoryRepository.findById(workLogId)
                .orElseThrow(() -> new NotFoundException("Запис не знайдений"));

        Claim claim = history.getClaim();

        // 1. статус заявки
        if (!claimStatusMachine.allowsWorkLog(claim.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("змінити work log", claim.getStatus(), claimStatusMachine.allowedWorkLogStatuses())
            );
        }

        // 2. доступ працівника
        accessService.checkEmployeeCanWork(claim.getId(), dto.getEmployeeId());

        BigDecimal oldHours = history.getTimeSpent();

        history.setActionDescription(dto.getDescription());
        history.setTimeSpent(dto.getHours());

        claimHistoryRepository.save(history);

        recalcClaimTotalTime(claim.getId());

        eventPublisher.publishEvent(
                new WorkLogUpdatedEvent(
                        claim.getId(),
                        dto.getEmployeeId(),
                        history.getId(),
                        oldHours,
                        dto.getHours()
                )
        );

        return map(history);
    }

    // =========================
    // DELETE WORK LOG
    // =========================
    @Transactional
    public void deleteWorkLog(Integer workLogId, Integer employeeId) {

        ClaimHistory history = claimHistoryRepository.findById(workLogId)
                .orElseThrow(() -> new NotFoundException("Запис не знайдений"));

        Claim claim = history.getClaim();

        // 1. статус заявки
        if (!claimStatusMachine.allowsWorkLog(claim.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("видалити work log", claim.getStatus(), claimStatusMachine.allowedWorkLogStatuses())
            );
        }

        // 2. доступ працівника
        accessService.checkEmployeeCanWork(claim.getId(), employeeId);

        BigDecimal hours = history.getTimeSpent();

        claimHistoryRepository.delete(history);

        recalcClaimTotalTime(claim.getId());

        eventPublisher.publishEvent(
                new WorkLogDeletedEvent(
                        claim.getId(),
                        employeeId,
                        history.getId(),
                        hours
                )
        );
    }

    @Transactional
    public ClaimHistoryResponseDTO addComment(CreateCommentDTO dto) {

        Claim claim = claimRepository.findById(dto.getClaimId())
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new NotFoundException("Працівник не знайдений"));

        ClaimHistory history = ClaimHistory.builder()
                .claim(claim)
                .employee(employee)
                .actionType(ActionType.COMMENT)
                .actionDescription(dto.getComment())
                .timeSpent(BigDecimal.ZERO)
                .actionDate(LocalDateTime.now())
                .build();

        claimHistoryRepository.save(history);
        return map(history);
    }

    @Transactional
    public void addSystemEvent(Integer claimId, Integer employeeId, ActionType type, String description) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new NotFoundException("Працівник не знайдений"));

        ClaimHistory history = ClaimHistory.builder()
                .claim(claim)
                .employee(employee)
                .actionType(type)
                .actionDate(LocalDateTime.now())
                .actionDescription(description)
                .timeSpent(BigDecimal.ZERO)
                .build();

        claimHistoryRepository.save(history);
    }

    public List<ClaimHistoryResponseDTO> getByClaim(Integer claimId) {
        return claimHistoryRepository.findByClaimIdOrderByActionDateAsc(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    public List<ClaimHistoryResponseDTO> getWorkLogs(Integer claimId) {
        return claimHistoryRepository.findByClaimIdOrderByActionDateAsc(claimId)
                .stream()
                .filter(h -> h.getActionType() == ActionType.WORK_LOG)
                .map(this::map)
                .toList();
    }

    // =========================
    // INTERNAL UTIL
    // =========================
    private void recalcClaimTotalTime(Integer claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow();

        BigDecimal total = claimHistoryRepository.sumWorkLogTime(claimId);
        claim.setTotalTimeSpent(total);
    }

    private ClaimHistoryResponseDTO map(ClaimHistory h) {
        return ClaimHistoryResponseDTO.builder()
                .id(h.getId())
                .claimId(h.getClaim().getId())
                .employeeId(h.getEmployee().getId())
                .actionType(h.getActionType())
                .description(h.getActionDescription())
                .timeSpent(h.getTimeSpent())
                .actionDate(h.getActionDate())
                .build();
    }
}