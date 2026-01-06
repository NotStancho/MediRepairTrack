package ua.nure.medirepairtrack.DTO.UserDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Employee.Position;

@Data
@Builder
public class LoginResponseDTO {
    private Integer userId;
    private String email;
    private String role;

    private String firstName;
    private String lastName;

    private Integer clientId;
    private Integer employeeId;

    private Position position; // MANAGER, SERVICE_ENGINEER
}

