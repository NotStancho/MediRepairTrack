package ua.nure.medirepairtrack.DTO.UserDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDTO {
    private Integer id;
    private String email;
    private String role;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phone;
}
