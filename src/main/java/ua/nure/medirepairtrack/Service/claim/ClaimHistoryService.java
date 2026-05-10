package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO.ClaimHistoryResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO.CreateCommentDTO;
import ua.nure.medirepairtrack.DTO.employee.EmployeeDTO.EmployeeShortDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ClaimHistory;
import ua.nure.medirepairtrack.Entity.employee.Employee.Employee;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.claim.ClaimHistoryRepository;
import ua.nure.medirepairtrack.Repository.claim.ClaimRepository;
import ua.nure.medirepairtrack.Repository.employee.EmployeeRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimHistoryService {

    private final ClaimHistoryRepository claimHistoryRepository;
    private final ClaimRepository claimRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public ClaimHistoryResponseDTO addComment(CreateCommentDTO dto) {

        Claim claim = claimRepository.findById(dto.getClaimId())
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new NotFoundException("Працівник не знайдений"));

        ClaimHistory history = ClaimHistory.builder()
                .claim(claim)
                .employee(employee)
                .actionType(ActionType.COMMENT)
                .actionDescription(dto.getComment())
                .actionDate(LocalDateTime.now())
                .build();

        claimHistoryRepository.save(history);
        return map(history);
    }

    @Transactional
    public void addSystemEvent(Integer claimId, Integer employeeId, ActionType type, String description) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new NotFoundException("Працівник не знайдений"));

        ClaimHistory history = ClaimHistory.builder()
                .claim(claim)
                .employee(employee)
                .actionType(type)
                .actionDate(LocalDateTime.now())
                .actionDescription(description)
                .build();

        claimHistoryRepository.save(history);
    }

    public List<ClaimHistoryResponseDTO> getByClaim(Integer claimId) {
        return claimHistoryRepository.findByClaimIdOrderByActionDateAsc(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    private ClaimHistoryResponseDTO map(ClaimHistory h) {
        Employee employee = h.getEmployee();

        return ClaimHistoryResponseDTO.builder()
                .id(h.getId())
                .claimId(h.getClaim().getId())
                .employeeId(h.getEmployee().getId())
                .employee(EmployeeShortDTO.builder()
                        .id(employee.getId())
                        .firstName(employee.getUser().getFirstName())
                        .lastName(employee.getUser().getLastName())
                        .position(employee.getPosition())
                        .availabilityStatus(employee.getAvailabilityStatus())
                        .build())
                .actionType(h.getActionType())
                .description(h.getActionDescription())
                .actionDate(h.getActionDate())
                .build();
    }
}
