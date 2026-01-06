package ua.nure.medirepairtrack.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.nure.medirepairtrack.DTO.UserDTO.LoginRequestDTO;
import ua.nure.medirepairtrack.DTO.UserDTO.LoginResponseDTO;
import ua.nure.medirepairtrack.Entity.Client.Client;
import ua.nure.medirepairtrack.Entity.Employee.Employee;
import ua.nure.medirepairtrack.Entity.User.Role;
import ua.nure.medirepairtrack.Entity.User.User;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Repository.ClientRepository;
import ua.nure.medirepairtrack.Repository.EmployeeRepository;
import ua.nure.medirepairtrack.Repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new BadRequestException("Невірний email або пароль"));

        // без хешування
        if (!user.getPassword().equals(dto.getPassword())) {
            throw new BadRequestException("Невірний email або пароль");
        }

        Integer clientId = null;
        Integer employeeId = null;
        Employee employee = null;

        if (user.getRole() == Role.CLIENT) {
            clientId = clientRepository.findByUserId(user.getId())
                    .map(Client::getId)
                    .orElse(null);
        }

        if (user.getRole() == Role.EMPLOYEE) {
            employee = employeeRepository.findByUserId(user.getId())
                    .orElseThrow(() ->
                            new BadRequestException("Працівник не знайдений для користувача")
                    );
            employeeId = employee.getId();
        }

        return LoginResponseDTO.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())

                .firstName(user.getFirstName())
                .lastName(user.getLastName())

                .clientId(clientId)
                .employeeId(employeeId)
                .position(employee != null ? employee.getPosition() : null)

                .build();
    }
}
