package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.ClaimRepairOperation.ClaimRepairOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.ClaimRepairOperation.CreateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.ClaimRepairOperation.UpdateClaimRepairOperationDTO;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.ClaimRepairOperation.ClaimRepairOperation;
import ua.nure.medirepairtrack.Entity.Employee.Employee;
import ua.nure.medirepairtrack.Entity.RepairOperation.RepairOperation;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.ClaimRepairOperationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimRepairOperationService {

    private final ClaimRepairOperationRepository repository;

    private final ClaimService claimService;
    private final RepairOperationService repairOperationService;
    private final EmployeeService employeeService;

    @Transactional
    public ClaimRepairOperationResponseDTO create(CreateClaimRepairOperationDTO dto) {

        Claim claim = claimService.getClaim(dto.getClaimId());

        RepairOperation operation = repairOperationService.getOperationEntity(dto.getOperationId());

        Employee employee = employeeService.getEmployeeEntity(dto.getEmployeeId());

        ClaimRepairOperation entity = ClaimRepairOperation.builder()
                .claim(claim)
                .operation(operation)
                .employee(employee)
                .timeSpent(dto.getTimeSpent())
                .note(dto.getNote())
                .createdAt(LocalDateTime.now())
                .build();

        return map(repository.save(entity));
    }

    @Transactional
    public ClaimRepairOperationResponseDTO update(Integer id, UpdateClaimRepairOperationDTO dto) {

        ClaimRepairOperation entity = getEntity(id);

        RepairOperation operation = repairOperationService.getOperationEntity(dto.getOperationId());

        entity.setOperation(operation);
        entity.setTimeSpent(dto.getTimeSpent());
        entity.setNote(dto.getNote());
        entity.setUpdatedAt(LocalDateTime.now());

        return map(repository.save(entity));
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

        repository.delete(entity);
    }

    public List<ClaimRepairOperation> getClaimOperations(Integer claimId) {

        return repository.findByClaimIdOrderByCreatedAt(claimId);
    }

    public ClaimRepairOperation getEntity(Integer id) {

        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запис операції ремонту не знайдено"));
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

}
