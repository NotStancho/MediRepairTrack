package ua.nure.medirepairtrack.DTO.user.UserDTO;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class RegisterUserDTO {

    @Email(message = "Невірний формат email")
    @NotBlank(message = "Email не може бути порожнім")
    private String email;

    @NotBlank(message = "Пароль обов'язковий")
    @Size(min = 6, max = 50, message = "Пароль має бути від 6 до 50 символів")
    private String password;

    @NotBlank(message = "Ім'я обов'язкове")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Прізвище обов'язкове")
    private String lastName;

    @NotBlank(message = "Телефон обов'язковий")
    @Pattern(regexp = "^\\+380\\d{9}$", message = "Невірний формат телефону")
    private String phone;
}