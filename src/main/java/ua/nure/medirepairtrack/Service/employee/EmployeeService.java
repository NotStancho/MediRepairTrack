package ua.nure.medirepairtrack.Service.employee;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.employee.EmployeeDTO.*;
import ua.nure.medirepairtrack.Entity.user.User.Role;
import ua.nure.medirepairtrack.Entity.user.User.User;
import ua.nure.medirepairtrack.Entity.employee.Employee.AvailabilityStatus;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.employee.EmployeeRepository;
import ua.nure.medirepairtrack.Repository.user.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @Transactional
    public EmployeeResponseDTO register(CreateEmployeeDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new NotFoundException("User не знайдено"));

        if (employeeRepository.findByUserId(dto.getUserId()).isPresent()) {
            throw new BadRequestException("Для цього user вже існує employee-профіль");
        }

        Employee employee = Employee.builder()
                .user(user)
                .position(dto.getPosition())
                .ratePerHour(dto.getRatePerHour())
                .specialization(dto.getSpecialization())
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .hireDate(LocalDate.now())
                .build();

        employeeRepository.save(employee);

        return map(employee);
    }

    @Transactional
    public EmployeeResponseDTO registerEmployeeWithUser(RegisterEmployeeWithUserDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email вже використовується");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(Role.EMPLOYEE)
                .firstName(dto.getFirstName())
                .middleName(dto.getMiddleName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        Employee employee = Employee.builder()
                .user(user)
                .position(dto.getPosition())
                .ratePerHour(dto.getRatePerHour())
                .specialization(dto.getSpecialization())
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .hireDate(LocalDate.now())
                .build();

        employeeRepository.save(employee);

        return map(employee);
    }

    public EmployeeResponseDTO update(Integer id, UpdateEmployeeDTO dto) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Співробітник не знайдений"));

        if (dto.getPosition() != null)
            emp.setPosition(dto.getPosition());

        if (dto.getRatePerHour() != null)
            emp.setRatePerHour(dto.getRatePerHour());

        if (dto.getSpecialization() != null)
            emp.setSpecialization(dto.getSpecialization());

        if (dto.getAvailabilityStatus() != null)
            emp.setAvailabilityStatus(dto.getAvailabilityStatus());

        employeeRepository.save(emp);
        return map(emp);
    }

    // --- Отримання по ID ---
    public EmployeeResponseDTO getById(Integer id) {
        return employeeRepository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Співробітник не знайдений"));
    }

    public List<EmployeeResponseDTO> getAll() {
        return employeeRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public Employee getEmployeeEntity(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Співробітник не знайдений"));
    }

    // --- Отримання по userId ---
    public EmployeeResponseDTO getByUserId(Integer userId) {
        return employeeRepository.findByUserId(userId)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Профіль співробітника не знайдений"));
    }

    // --- Отримання повної інформації про працівник ---
    public EmployeeFullResponseDTO getFullById(Integer id) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Працівника не знайдено"));

        return mapFull(e);
    }

    // --- Пошук вільного інженера ---
    public List<EmployeeResponseDTO> findAvailableEngineers() {
        return employeeRepository
                .findByAvailabilityStatusAndPosition(AvailabilityStatus.AVAILABLE, Position.SERVICE_ENGINEER)
                .stream()
                .map(this::map)
                .toList();
    }

    // --- Пошук за посадою ---
    public List<EmployeeResponseDTO> findByPosition(Position position) {
        return employeeRepository.findByPosition(position)
                .stream()
                .map(this::map)
                .toList();
    }

    // --- Пошук працівників за спеціалізацією ---
    public List<EmployeeResponseDTO> searchBySpecialization(String specialization) {
        return employeeRepository.findBySpecializationContainingIgnoreCase(specialization)
                .stream()
                .map(this::map)
                .toList();
    }

    // --- Отримання ставки працівника ---
    public Double getRate(Integer employeeId) {
        return employeeRepository.findById(employeeId)
                .map(Employee::getRatePerHour)
                .orElseThrow(() -> new NotFoundException("Співробітник не знайдений"));
    }

    // --- Видалення ---
    public void delete(Integer id) {
        if (!employeeRepository.existsById(id))
            throw new NotFoundException("Співробітник не знайдений");

        employeeRepository.deleteById(id);
    }

    // --- Mapping ---
    private EmployeeResponseDTO map(Employee e) {
        return EmployeeResponseDTO.builder()
                .id(e.getId())
                .userId(e.getUser().getId())
                .userEmail(e.getUser().getEmail())
                .userFirstName(e.getUser().getFirstName())
                .userLastName(e.getUser().getLastName())
                .position(e.getPosition())
                .ratePerHour(e.getRatePerHour())
                .specialization(e.getSpecialization())
                .availabilityStatus(e.getAvailabilityStatus())
                .hireDate(e.getHireDate())
                .build();
    }

    private EmployeeFullResponseDTO mapFull(Employee e) {
        User u = e.getUser();

        return EmployeeFullResponseDTO.builder()
                .id(e.getId())

                .userId(u.getId())
                .email(u.getEmail())
                .firstName(u.getFirstName())
                .middleName(u.getMiddleName())
                .lastName(u.getLastName())
                .phone(u.getPhone())
                .role(u.getRole())

                .position(e.getPosition())
                .ratePerHour(e.getRatePerHour())
                .specialization(e.getSpecialization())
                .availabilityStatus(e.getAvailabilityStatus())
                .hireDate(e.getHireDate())
                .build();
    }
}
