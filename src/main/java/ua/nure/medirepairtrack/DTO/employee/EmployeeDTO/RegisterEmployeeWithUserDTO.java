package ua.nure.medirepairtrack.DTO.employee.EmployeeDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;

@Data
public class RegisterEmployeeWithUserDTO {

    // ---------- USER FIELDS ----------
    @Email(message = "Невірний формат email")
    @NotBlank(message = "Email обов'язковий")
    private String email;

    @NotBlank(message = "Пароль обов'язковий")
    @Size(min = 6, max = 50)
    private String password;

    @NotBlank(message = "Ім'я обов'язкове")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Прізвище обов'язкове")
    private String lastName;

    @NotBlank(message = "Телефон обов'язковий")
    @Pattern(regexp = "^\\+380\\d{9}$", message = "Телефон має бути у форматі +380XXXXXXXXX")
    private String phone;

    // ---------- EMPLOYEE FIELDS ----------
    @NotNull(message = "Позиція обов'язкова")
    private Position position;

    @NotNull(message = "Ставка обов'язкова")
    @Positive(message = "Ставка повинна бути > 0")
    private Double ratePerHour;

    @NotBlank(message = "Спеціалізація обов'язкова")
    private String specialization;
}
