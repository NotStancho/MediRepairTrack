package ua.nure.medirepairtrack.DTO.EmployeeDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Employee.AvailabilityStatus;
import ua.nure.medirepairtrack.Entity.Employee.Position;
import ua.nure.medirepairtrack.Entity.User.Role;

import java.time.LocalDate;

@Data
@Builder
public class EmployeeFullResponseDTO {

    private Integer id;

    // USER PART
    private Integer userId;
    private String email;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phone;
    private Role role;

    // EMPLOYEE PART
    private Position position;
    private Double ratePerHour;
    private String specialization;
    private AvailabilityStatus availabilityStatus;
    private LocalDate hireDate;
}
