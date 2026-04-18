package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimDefectCategory.ClaimDefectCategoryResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimDefectCategory.CreateClaimDefectCategoryDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.diagnosis.DefectCategory.DefectCategory;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.claim.ClaimDefectCategory.ClaimDefectCategory;
import ua.nure.medirepairtrack.Entity.claim.ClaimDefectCategory.ClaimDefectCategoryId;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.claim.ClaimDefectCategoryRepository;
import ua.nure.medirepairtrack.Service.diagnosis.DefectCategoryService;
import ua.nure.medirepairtrack.Service.employee.EmployeeService;

import java.time.LocalDateTime;
import java.util.List;

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
    public void delete(Integer claimId, Integer defectCategoryId) {

        ClaimDefectCategory entity = repository.findById(
                new ClaimDefectCategoryId(claimId, defectCategoryId))
                .orElseThrow(() -> new NotFoundException("Категорію дефекту для заявки не знайдено"));

        repository.delete(entity);
    }

    public List<ClaimDefectCategoryResponseDTO> getByClaim(Integer claimId) {

        return repository.findAllByClaimIdOrderByCreatedAt(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    public List<ClaimDefectCategory> getByClaimId(Integer claimId) {
        return repository.findAllByClaimId(claimId);
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