package ua.nure.medirepairtrack.DTO.employee.EmployeeDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.employee.Employee.AvailabilityStatus;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;

import java.time.LocalDate;

@Data
@Builder
public class EmployeeResponseDTO {

    private Integer id;
    private Integer userId;

    private String userEmail;
    private String userFirstName;
    private String userLastName;

    private Position position;
    private Double ratePerHour;
    private String specialization;
    private AvailabilityStatus availabilityStatus;

    private LocalDate hireDate;
}
