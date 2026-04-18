package ua.nure.medirepairtrack.DTO.employee.EmployeeDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;

@Data
public class CreateEmployeeDTO {

    @NotNull(message = "fk_user обов'язковий")
    private Integer userId;

    @NotNull(message = "Позиція обов'язкова")
    private Position position;

    @NotNull(message = "Ставка обов'язкова")
    @Positive(message = "Ставка повинна бути > 0")
    private Double ratePerHour;

    @NotBlank(message = "Спеціалізація обов'язкова")
    private String specialization;
}
