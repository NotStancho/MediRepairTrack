package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.ClaimEmployeeId;
import ua.nure.medirepairtrack.Entity.employee.Employee.Position;
import ua.nure.medirepairtrack.Repository.claim.ClaimEmployeeRepository;
import ua.nure.medirepairtrack.Repository.employee.EmployeeRepository;

@Service
@RequiredArgsConstructor
public class ClaimAccessService {

    private final ClaimEmployeeRepository claimEmployeeRepository;
    private final EmployeeRepository employeeRepository;

    public void checkEmployeeCanWork(Integer claimId, Integer employeeId) {

        // SYSTEM user — завжди можна
        if (isSystem(employeeId)) {
            return;
        }

        // менеджер — завжди можна
        if (isManager(employeeId)) {
            return;
        }

        // інакше — має бути призначений до заявки
        boolean assigned = claimEmployeeRepository.existsById(new ClaimEmployeeId(claimId, employeeId));

        if (!assigned) {
            throw new IllegalStateException("Працівник не призначений до заявки");
        }
    }

    private boolean isSystem(Integer employeeId) {
        return employeeRepository.findById(employeeId)
                .map(e -> e.getPosition() == Position.SYSTEM)
                .orElse(false);
    }

    private boolean isManager(Integer employeeId) {
        return employeeRepository.findById(employeeId)
                .map(e -> e.getPosition() == Position.MANAGER)
                .orElse(false);
    }
}

