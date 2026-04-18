package ua.nure.medirepairtrack.Service.repair;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.repair.RepairOperation.CreateRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairOperation.RepairOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairOperation.RepairOperationShortDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairOperation.UpdateRepairOperationDTO;
import ua.nure.medirepairtrack.Entity.DSS.ComplexityLevel;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.repair.RepairOperation.RepairOperation;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.repair.RepairOperationRepository;
import ua.nure.medirepairtrack.Service.DSS.ComplexityLevelService;
import ua.nure.medirepairtrack.Service.employee.EmployeeService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairOperationService {

    private final RepairOperationRepository repository;
    private final ComplexityLevelService complexityLevelService;
    private final EmployeeService employeeService;

    @Transactional
    public RepairOperationResponseDTO create(CreateRepairOperationDTO dto, Integer employeeId) {
        if (repository.existsByName(dto.getName())) {
            throw new BadRequestException("Операція з такою назвою вже існує");
        }

        ComplexityLevel complexityLevel = complexityLevelService.getEntity(dto.getComplexityLevelId());

        Employee employee = employeeService.getEmployeeEntity(employeeId);

        RepairOperation entity = RepairOperation.builder()
                .complexityLevel(complexityLevel)
                .name(dto.getName())
                .description(dto.getDescription())
                .createdByEmployee(employee)
                .createdAt(LocalDateTime.now())
                .build();

        return map(repository.save(entity));
    }

    @Transactional
    public RepairOperationResponseDTO update(Integer id, UpdateRepairOperationDTO dto) {

        RepairOperation entity = getOperationEntity(id);

        if (!entity.getName().equals(dto.getName())
                && repository.existsByName(dto.getName())) {

            throw new BadRequestException("Операція з такою назвою вже існує");
        }

        ComplexityLevel complexityLevel = complexityLevelService.getEntity(dto.getComplexityLevelId());

        entity.setComplexityLevel(complexityLevel);
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setUpdatedAt(LocalDateTime.now());

        return map(repository.save(entity));
    }

    public RepairOperationResponseDTO getById(Integer id) {
        return map(getOperationEntity(id));
    }

    public List<RepairOperationResponseDTO> getAll() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public List<RepairOperationShortDTO> getAllOperationsShort() {

        return repository.findAll()
                .stream()
                .map(this::mapShort)
                .toList();
    }

    @Transactional
    public void delete(Integer id) {

        RepairOperation entity = getOperationEntity(id);

        repository.delete(entity);
    }

    public RepairOperation getOperationEntity(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Ремонтну операцію не знайдено"));
    }

    private RepairOperationResponseDTO map(RepairOperation e) {

        return RepairOperationResponseDTO.builder()
                .id(e.getId())
                .complexityLevelId(e.getComplexityLevel().getId())
                .name(e.getName())
                .description(e.getDescription())
                .createdByEmployeeId(e.getCreatedByEmployee().getId())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private RepairOperationShortDTO mapShort(RepairOperation e) {
        return RepairOperationShortDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .complexityLevelName(e.getComplexityLevel().getName())
                .build();
    }
}