package ua.nure.medirepairtrack.DTO.employee.EmployeeDTO;

import lombok.Builder;
import lombok.Getter;
import ua.nure.medirepairtrack.Entity.employee.Employee.AvailabilityStatus;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;

@Builder
@Getter
public class EmployeeShortDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private Position position;
    private AvailabilityStatus availabilityStatus;
}
