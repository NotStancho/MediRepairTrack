package ua.nure.medirepairtrack.Repository.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query("""
                SELECT e
                FROM Employee e
                WHERE e.id <> :performedByEmployeeId
                  AND e.position NOT IN ('MANAGER', 'SYSTEM')
                  AND e.availabilityStatus IN ('AVAILABLE', 'BUSY')
                  AND e.id NOT IN (
                        SELECT ce.employee.id
                        FROM ClaimEmployee ce
                        WHERE ce.claim.id = :claimId
                  )
                ORDER BY e.user.lastName, e.user.firstName
            """)
    List<Employee> findAssignableEmployees(Integer claimId, Integer performedByEmployeeId);
}