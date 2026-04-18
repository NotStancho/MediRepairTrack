package ua.nure.medirepairtrack.DTO.client.ClientDTO;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class CreateClientDTO {
    private Integer userId; // може бути null

    @NotBlank(message = "Назва організації обов'язкова")
    private String organizationName;

    @Email(message = "Невірний формат email організації")
    @NotBlank(message = "Email організації обов'язковий")
    private String organizationEmail;

    @NotBlank(message = "Телефон організації обов'язковий")
    @Pattern(regexp = "^\\+380\\d{9}$", message = "Телефон повинен бути у форматі +380XXXXXXXXX")
    private String organizationPhoneNumber;

    private String contactPersonName;

    @NotBlank(message = "Адреса обов'язкова")
    private String address;

    private String notes;
}
