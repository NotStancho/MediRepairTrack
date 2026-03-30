package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.CreateAutoDiagnosisDTO;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.CreateManualDiagnosisDTO;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.DiagnosisResponseDTO;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.UpdateDiagnosisDTO;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.Diagnosis.DiagnosisStatus;
import ua.nure.medirepairtrack.Entity.Diagnosis.DiagnosisType;
import ua.nure.medirepairtrack.Entity.Employee.Employee;
import ua.nure.medirepairtrack.Event.Diagnosis.DiagnosisCreatedEvent;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.InvalidStatusTransitionException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.DiagnosisRepository;
import ua.nure.medirepairtrack.Workflow.DiagnosisStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;
    private final ClaimService claimService;
    private final EmployeeService employeeService;

    private final ApplicationEventPublisher eventPublisher;

    private final DiagnosisStatusMachine diagnosisStatusMachine;

    @Transactional
    public DiagnosisResponseDTO createManualDiagnosis(CreateManualDiagnosisDTO dto) {

        Claim claim = claimService.getClaim(dto.getClaimId());
        Employee engineer = employeeService.getEmployeeEntity(dto.getEngineerId());

        String conclusion = dto.getPreliminaryConclusion() != null
                ? dto.getPreliminaryConclusion()
                : "";

        BigDecimal cost = dto.getEstimatedCost() != null
                ? dto.getEstimatedCost()
                : BigDecimal.ZERO;

        BigDecimal time = dto.getEstimatedTimeHours() != null
                ? dto.getEstimatedTimeHours()
                : BigDecimal.ZERO;

        Diagnosis diagnosis = Diagnosis.builder()
                .claim(claim)
                .engineer(engineer)
                .preliminaryConclusion(conclusion)
                .estimatedCost(cost)
                .estimatedTimeHours(time)
                .diagnosisType(DiagnosisType.MANUAL)
                .status(DiagnosisStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .build();

        return map(diagnosisRepository.save(diagnosis));
    }

    @Transactional
    public DiagnosisResponseDTO createAutoDiagnosis(CreateAutoDiagnosisDTO dto) {

        Claim claim = claimService.getClaim(dto.getClaimId());

        Diagnosis diagnosis = Diagnosis.builder()
                .claim(claim)
                .engineer(null)
                .preliminaryConclusion("")
                .estimatedCost(BigDecimal.ZERO)
                .estimatedTimeHours(BigDecimal.ZERO)
                .diagnosisType(DiagnosisType.AUTOMATED)
                .status(DiagnosisStatus.PREDICTED)
                .createdAt(LocalDateTime.now())
                .build();

        Diagnosis saved = diagnosisRepository.save(diagnosis);

        eventPublisher.publishEvent(
                new DiagnosisCreatedEvent(saved.getId())
        );

        return map(saved);
    }

    @Transactional
    public DiagnosisResponseDTO updateDiagnosis(Integer id, UpdateDiagnosisDTO dto) {

        Diagnosis diagnosis = getDiagnosisEntity(id);

        if (!diagnosisStatusMachine.allowsDiagnosisEdit(diagnosis.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "редагувати діагностику",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisEditStatuses()
                    )
            );
        }

        if (dto.getPreliminaryConclusion() != null) {
            diagnosis.setPreliminaryConclusion(dto.getPreliminaryConclusion());
        }

        if (dto.getFinalConclusion() != null) {
            diagnosis.setFinalConclusion(dto.getFinalConclusion());
        }

        if (dto.getEstimatedCost() != null) {
            diagnosis.setEstimatedCost(dto.getEstimatedCost());
        }

        if (dto.getEstimatedTimeHours() != null) {
            diagnosis.setEstimatedTimeHours(dto.getEstimatedTimeHours());
        }

        // AI -> HYBRID якщо інженер редагує
        if (diagnosis.getDiagnosisType() == DiagnosisType.AUTOMATED) {
            diagnosis.setDiagnosisType(DiagnosisType.HYBRID);
        }

        diagnosis.setUpdatedAt(LocalDateTime.now());

        return map(diagnosisRepository.save(diagnosis));
    }

    @Transactional
    public DiagnosisResponseDTO confirmDiagnosis(Integer id, Integer engineerId) {

        Diagnosis diagnosis = getDiagnosisEntity(id);

        Employee engineer = employeeService.getEmployeeEntity(engineerId);

        if (!diagnosisStatusMachine.allowsDiagnosisConfirm(diagnosis.getStatus())) {
            throw new InvalidStatusTransitionException(
                    StatusMessageUtil.denied(
                            "підтвердити діагностику",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisConfirmStatuses()
                    )
            );
        }

        if (diagnosis.getFinalConclusion() == null || diagnosis.getFinalConclusion().isBlank()) {
            throw new BadRequestException("Потрібно вказати остаточний висновок діагностики");
        }

        if (diagnosis.getEstimatedCost().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Оцінка вартості повинна бути більшою за нуль");
        }

        if (diagnosis.getEstimatedTimeHours().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Оцінка часу ремонту повинна бути більшою за нуль");
        }

        diagnosis.setEngineer(engineer);
        diagnosis.setStatus(DiagnosisStatus.CONFIRMED);
        diagnosis.setConfirmedAt(LocalDateTime.now());
        diagnosis.setUpdatedAt(LocalDateTime.now());

        return map(diagnosisRepository.save(diagnosis));
    }

    @Transactional
    public DiagnosisResponseDTO rejectDiagnosis(Integer id) {

        Diagnosis diagnosis = getDiagnosisEntity(id);

        if (!diagnosisStatusMachine.allowsDiagnosisReject(diagnosis.getStatus())) {
            throw new InvalidStatusTransitionException(
                    StatusMessageUtil.denied(
                            "відхилити діагностику",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisRejectStatuses()
                    )
            );
        }

        diagnosis.setStatus(DiagnosisStatus.REJECTED);
        diagnosis.setUpdatedAt(LocalDateTime.now());

        return map(diagnosisRepository.save(diagnosis));
    }

    @Transactional
    public DiagnosisResponseDTO archiveDiagnosis(Integer id) {

        Diagnosis diagnosis = getDiagnosisEntity(id);

        if (!diagnosisStatusMachine.allowsDiagnosisArchive(diagnosis.getStatus())) {
            throw new InvalidStatusTransitionException(
                    StatusMessageUtil.denied(
                            "архівувати діагностику",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisArchiveStatuses()
                    )
            );
        }

        diagnosis.setStatus(DiagnosisStatus.ARCHIVED);
        diagnosis.setUpdatedAt(LocalDateTime.now());

        return map(diagnosisRepository.save(diagnosis));
    }

    public Diagnosis getDiagnosisEntity(Integer id) {
        return diagnosisRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Діагностику з таким ID не знайдено"));
    }

    public DiagnosisResponseDTO getDiagnosis(Integer id) {
        return map(getDiagnosisEntity(id));
    }

    public List<DiagnosisResponseDTO> getClaimDiagnoses(Integer claimId) {
        return diagnosisRepository.findByClaimIdOrderByCreatedAtDesc(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    private DiagnosisResponseDTO map(Diagnosis d) {
        return DiagnosisResponseDTO.builder()
                .id(d.getId())
                .claimId(d.getClaim().getId())
                .engineerId(d.getEngineer() != null ? d.getEngineer().getId() : null)
                .preliminaryConclusion(d.getPreliminaryConclusion())
                .finalConclusion(d.getFinalConclusion())
                .estimatedCost(d.getEstimatedCost())
                .estimatedTimeHours(d.getEstimatedTimeHours())
                .diagnosisType(d.getDiagnosisType())
                .status(d.getStatus())
                .createdAt(d.getCreatedAt())
                .updatedAt(d.getUpdatedAt())
                .confirmedAt(d.getConfirmedAt())
                .build();
    }
}