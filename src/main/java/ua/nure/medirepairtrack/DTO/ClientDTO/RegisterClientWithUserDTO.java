package ua.nure.medirepairtrack.DTO.ClientDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterClientWithUserDTO {

    // ---------- USER FIELDS ----------
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
    @Pattern(regexp = "^\\+380\\d{9}$", message = "Телефон має бути у форматі +380XXXXXXXXX")
    private String phone;


    // ---------- CLIENT FIELDS ----------
    @NotBlank(message = "Назва організації обов'язкова")
    private String organizationName;

    @Email(message = "Невірний формат email організації")
    @NotBlank(message = "Email організації обов'язковий")
    private String organizationEmail;

    @NotBlank(message = "Телефон організації обов'язковий")
    @Pattern(regexp = "^\\+380\\d{9}$", message = "Телефон організації має бути у форматі +380XXXXXXXXX")
    private String organizationPhoneNumber;

    private String contactPersonName;

    @NotBlank(message = "Адреса обов'язкова")
    private String address;

    private String notes;
}
