package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.ClaimEmployeeId;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.claim.ClaimEmployeeRepository;
import ua.nure.medirepairtrack.Repository.employee.EmployeeRepository;

@Service
@RequiredArgsConstructor
public class ClaimAccessService {

    private final ClaimEmployeeRepository claimEmployeeRepository;
    private final EmployeeRepository employeeRepository;

    public void validateEmployeeCanAccessClaim(Integer claimId, Integer employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new OperationNotAllowedException("Працівник не знайдений"));

        // SYSTEM user — завжди можна
        if (employee.getPosition() == Position.SYSTEM) {
            return;
        }

        // менеджер — завжди можна
        if (employee.getPosition() == Position.MANAGER) {
            return;
        }

        // інакше — має бути призначений до заявки
        if (!isAssignedToClaim(claimId, employeeId)) {
            throw new OperationNotAllowedException("Працівник не призначений до заявки");
        }
    }

    public void validateEmployeeCanWorkOnClaim(Integer claimId, Integer employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new OperationNotAllowedException("Працівник не знайдений"));

        if (employee.getPosition() == Position.MANAGER) {
            throw new OperationNotAllowedException("Менеджер не може виконувати дії над ремонтними роботами");
        }

        if (!isAssignedToClaim(claimId, employeeId)) {
            throw new OperationNotAllowedException("Працівник не призначений до заявки");
        }
    }

    public boolean isAssignedToClaim(Integer claimId, Integer employeeId) {
        if (claimId == null || employeeId == null) {
            return false;
        }

        return claimEmployeeRepository.existsById(new ClaimEmployeeId(claimId, employeeId));
    }

    public boolean isLeadOnClaim(Integer claimId, Integer employeeId) {
        if (claimId == null || employeeId == null) {
            return false;
        }

        return claimEmployeeRepository.findByIdClaimIdAndIdEmployeeId(claimId, employeeId)
                .map(claimEmployee -> claimEmployee.getRoleInClaim() == RoleInClaim.LEAD)
                .orElse(false);
    }
}
