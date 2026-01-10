package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.EmployeeDTO.*;
import ua.nure.medirepairtrack.Entity.Employee.Position;
import ua.nure.medirepairtrack.Service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // --- Створення employee для існуючого user ---
    @PostMapping
    public EmployeeResponseDTO register(@Valid @RequestBody CreateEmployeeDTO dto) {
        return employeeService.register(dto);
    }

    // --- Створення user + employee одним запитом ---
    @PostMapping("/register-with-user")
    public EmployeeResponseDTO registerWithUser(@Valid @RequestBody RegisterEmployeeWithUserDTO dto) {
        return employeeService.registerEmployeeWithUser(dto);
    }

    @PutMapping("/{id}")
    public EmployeeResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateEmployeeDTO dto) {
        return employeeService.update(id, dto);
    }

    @GetMapping("/{id}")
    public EmployeeResponseDTO getById(@PathVariable Integer id) {
        return employeeService.getById(id);
    }

    @GetMapping("/user/{userId}")
    public EmployeeResponseDTO getByUser(@PathVariable Integer userId) {
        return employeeService.getByUserId(userId);
    }

    @GetMapping("/{id}/full")
    public EmployeeFullResponseDTO getFull(@PathVariable Integer id) {
        return employeeService.getFullById(id);
    }

    @GetMapping("/available-engineers")
    public List<EmployeeResponseDTO> findAvailableEngineers() {
        return employeeService.findAvailableEngineers();
    }

    @GetMapping("/search/specialization")
    public List<EmployeeResponseDTO> searchBySpecialization(@RequestParam String specialization) {
        return employeeService.searchBySpecialization(specialization);
    }

    @GetMapping("/position/{position}")
    public List<EmployeeResponseDTO> findByPosition(@PathVariable Position position) {
        return employeeService.findByPosition(position);
    }

    @GetMapping("/{id}/rate")
    public Double getRate(@PathVariable Integer id) {
        return employeeService.getRate(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        employeeService.delete(id);
    }
}
