package ua.nure.medirepairtrack.DTO.UserDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateUserDTO {
    @Size(min = 1, message = "Ім'я не може бути порожнім")
    private String firstName;

    private String middleName;

    @Size(min = 1, message = "Прізвище не може бути порожнім")
    private String lastName;

    @Pattern(regexp = "^\\+380\\d{9}$", message = "Невірний формат телефону")
    private String phone;
}
