package ua.nure.medirepairtrack.DTO.EmployeeDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Employee.AvailabilityStatus;
import ua.nure.medirepairtrack.Entity.Employee.Position;
import ua.nure.medirepairtrack.Entity.Employee.*;

@Data
public class UpdateEmployeeDTO {

    private Position position;

    @Positive(message = "Ставка повинна бути > 0")
    private Double ratePerHour;

    private String specialization;

    private AvailabilityStatus availabilityStatus;
}
