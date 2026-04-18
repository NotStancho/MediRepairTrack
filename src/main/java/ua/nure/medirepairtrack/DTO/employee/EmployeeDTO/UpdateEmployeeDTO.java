package ua.nure.medirepairtrack.DTO.employee.EmployeeDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.employee.Employee.AvailabilityStatus;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;

@Data
public class UpdateEmployeeDTO {

    private Position position;

    @Positive(message = "Ставка повинна бути > 0")
    private Double ratePerHour;

    private String specialization;

    private AvailabilityStatus availabilityStatus;
}
