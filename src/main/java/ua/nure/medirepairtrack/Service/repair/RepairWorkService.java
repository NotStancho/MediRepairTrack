package ua.nure.medirepairtrack.Service.repair;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.CreateRepairWorkDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.RepairWorkResponseDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.RepairWorkShortDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.UpdateRepairWorkDTO;
import ua.nure.medirepairtrack.Entity.DSS.ComplexityLevel;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.repair.RepairWork.RepairWork;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.repair.RepairWorkRepository;
import ua.nure.medirepairtrack.Service.DSS.ComplexityLevelService;
import ua.nure.medirepairtrack.Service.employee.EmployeeService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepairWorkService {

    private final RepairWorkRepository repository;
    private final ComplexityLevelService complexityLevelService;
    private final EmployeeService employeeService;

    @Transactional
    public RepairWorkResponseDTO create(CreateRepairWorkDTO dto, Integer employeeId) {
        if (repository.existsByName(dto.getName())) {
            throw new BadRequestException("Ремонтна робота з такою назвою вже існує");
        }

        ComplexityLevel complexityLevel = complexityLevelService.getEntity(dto.getComplexityLevelId());

        Employee employee = employeeService.getEmployeeEntity(employeeId);

        RepairWork entity = RepairWork.builder()
                .complexityLevel(complexityLevel)
                .name(dto.getName())
                .description(dto.getDescription())
                .createdByEmployee(employee)
                .createdAt(LocalDateTime.now())
                .build();

        return map(repository.save(entity));
    }

    @Transactional
    public RepairWorkResponseDTO update(Integer id, UpdateRepairWorkDTO dto) {

        RepairWork entity = getEntity(id);

        if (!entity.getName().equals(dto.getName())
                && repository.existsByName(dto.getName())) {

            throw new BadRequestException("Ремонтна робота з такою назвою вже існує");
        }

        ComplexityLevel complexityLevel = complexityLevelService.getEntity(dto.getComplexityLevelId());

        entity.setComplexityLevel(complexityLevel);
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setUpdatedAt(LocalDateTime.now());

        return map(repository.save(entity));
    }

    public RepairWorkResponseDTO getById(Integer id) {
        return map(getEntity(id));
    }

    public List<RepairWorkResponseDTO> getAll() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public List<RepairWorkShortDTO> getAllShort() {

        return repository.findAll()
                .stream()
                .map(this::mapShort)
                .toList();
    }

    @Transactional
    public void delete(Integer id) {

        RepairWork entity = getEntity(id);

        repository.delete(entity);
    }

    public RepairWork getEntity(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Ремонтну роботу не знайдено"));
    }

    private RepairWorkResponseDTO map(RepairWork e) {

        return RepairWorkResponseDTO.builder()
                .id(e.getId())
                .complexityLevelId(e.getComplexityLevel().getId())
                .name(e.getName())
                .description(e.getDescription())
                .createdByEmployeeId(e.getCreatedByEmployee().getId())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private RepairWorkShortDTO mapShort(RepairWork e) {
        return RepairWorkShortDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .complexityLevelName(e.getComplexityLevel().getName())
                .build();
    }
}
