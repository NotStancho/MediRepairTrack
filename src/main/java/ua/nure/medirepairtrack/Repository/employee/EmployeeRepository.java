package ua.nure.medirepairtrack.Repository.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.employee.Employee.AvailabilityStatus;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByUserId(Integer userId);

    List<Employee> findByAvailabilityStatusAndPosition(AvailabilityStatus status, Position position);

    List<Employee> findByPosition(Position position);

    List<Employee> findBySpecializationContainingIgnoreCase(String specialization);

}