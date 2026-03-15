package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.ClaimDefectCategory.*;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.ClaimDefectCategory.*;
import ua.nure.medirepairtrack.Entity.DefectCategory.DefectCategory;
import ua.nure.medirepairtrack.Entity.Employee.Employee;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.ClaimDefectCategoryRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ClaimDefectCategoryService {

    private final ClaimDefectCategoryRepository repository;

    private final ClaimService claimService;
    private final DefectCategoryService defectCategoryService;
    private final EmployeeService employeeService;

    @Transactional
    public ClaimDefectCategoryResponseDTO create(CreateClaimDefectCategoryDTO dto) {

        Claim claim = claimService.getClaim(dto.getClaimId());
        DefectCategory defect = defectCategoryService.getEntity(dto.getDefectCategoryId());
        Employee employee = employeeService.getEmployeeEntity(dto.getEmployeeId());

        if (repository.findByClaimId(dto.getClaimId()).isPresent()) {
            throw new OperationNotAllowedException("Категорія дефекту для цієї заявки вже встановлена");
        }

        ClaimDefectCategory entity = ClaimDefectCategory.builder()
                .id(new ClaimDefectCategoryId(dto.getClaimId(), dto.getDefectCategoryId()))
                .claim(claim)
                .defectCategory(defect)
                .employee(employee)
                .createdAt(LocalDateTime.now())
                .build();

        return map(repository.save(entity));
    }

    @Transactional
    public ClaimDefectCategoryResponseDTO update(Integer claimId, UpdateClaimDefectCategoryDTO dto) {

        ClaimDefectCategory existing = repository.findByClaimId(claimId)
                .orElseThrow(() -> new NotFoundException("Категорію дефекту для заявки не знайдено"));

        repository.delete(existing);

        Claim claim = claimService.getClaim(claimId);
        DefectCategory defect = defectCategoryService.getEntity(dto.getDefectCategoryId());
        Employee employee = employeeService.getEmployeeEntity(dto.getEmployeeId());

        ClaimDefectCategory entity = ClaimDefectCategory.builder()
                .id(new ClaimDefectCategoryId(claimId, dto.getDefectCategoryId()))
                .claim(claim)
                .defectCategory(defect)
                .employee(employee)
                .createdAt(LocalDateTime.now())
                .build();

        return map(repository.save(entity));
    }

    @Transactional
    public void delete(Integer claimId) {

        ClaimDefectCategory entity = repository.findByClaimId(claimId)
                .orElseThrow(() -> new NotFoundException("Категорію дефекту для заявки не знайдено"));

        repository.delete(entity);
    }

    public ClaimDefectCategory getByClaimId(Integer claimId) {

        return repository.findByClaimId(claimId)
                .orElse(null);
    }

    public ClaimDefectCategory getClaimDefectCategoryEntity(Integer claimId, Integer defectCategoryId) {

        return repository.findById(new ClaimDefectCategoryId(claimId, defectCategoryId))
                .orElseThrow(() -> new NotFoundException("Категорію дефекту для заявки не знайдено"));
    }

    private ClaimDefectCategoryResponseDTO map(ClaimDefectCategory e) {

        return ClaimDefectCategoryResponseDTO.builder()
                .claimId(e.getClaim().getId())
                .defectCategoryId(e.getDefectCategory().getId())
                .employeeId(e.getEmployee().getId())
                .createdAt(e.getCreatedAt())
                .build();
    }

}