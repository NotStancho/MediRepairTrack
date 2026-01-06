package ua.nure.medirepairtrack.DTO.ClientDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateClientDTO {

    private String organizationName;

    @Email(message = "Невірний формат email організації")
    private String organizationEmail;

    @Pattern(regexp = "^\\+380\\d{9}$", message = "Телефон повинен бути у форматі +380XXXXXXXXX")
    private String organizationPhoneNumber;

    private String contactPersonName;

    private String address;

    private String notes;
}