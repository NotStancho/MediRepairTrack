package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ua.nure.medirepairtrack.DTO.claim.ClaimDTO.*;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;
import ua.nure.medirepairtrack.Event.Claim.ClaimCreatedEvent;
import ua.nure.medirepairtrack.Event.Claim.ClaimStatusChangedEvent;
import ua.nure.medirepairtrack.Exception.InvalidStatusTransitionException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.claim.ClaimRepository;
import ua.nure.medirepairtrack.Repository.client.ClientRepository;
import ua.nure.medirepairtrack.Repository.delivery.DeliveryRepository;
import ua.nure.medirepairtrack.Repository.billing.InvoiceRepository;
import ua.nure.medirepairtrack.Entity.client.Client.Client;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryStatus;
import ua.nure.medirepairtrack.Entity.equipment.Equipment.Equipment;
import ua.nure.medirepairtrack.Entity.billing.Invoice.Invoice;
import ua.nure.medirepairtrack.Entity.billing.Invoice.InvoiceStatus;
import ua.nure.medirepairtrack.Event.Claim.*;
import ua.nure.medirepairtrack.Service.equipment.EquipmentService;
import ua.nure.medirepairtrack.Workflow.ClaimStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;

    private final ClientRepository clientRepository;
    private final InvoiceRepository invoiceRepository;
    private final DeliveryRepository deliveryRepository;

    private final EquipmentService equipmentService;

    private final ApplicationEventPublisher eventPublisher;

    private final ClaimStatusMachine claimStatusMachine;

    private final ClaimAccessService accessService;

    @Transactional
    public ClaimResponseDTO create(CreateClaimDTO dto) {

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new NotFoundException("Клієнт не знайдений"));

        Equipment equipment = equipmentService.getOrCreate(dto.getEquipment());

        Claim claim = Claim.builder()
                .client(client)
                .equipment(equipment)
                .repairType(RepairType.WAITING_DECISION)
                .status(Status.NEW)
                .defectDescription(dto.getDefectDescription())
                .totalTimeSpent(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .closedAt(null)
                .build();

        claimRepository.save(claim);

        // EVENT: creatorEmployeeId = null (створив клієнт)
        publishClaimCreatedEvent(claim, null);

        return mapToResponse(claim);
    }

    @Transactional
    public ClaimResponseDTO createByEmployee(CreateClaimByEmployeeDTO dto) {

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new NotFoundException("Клієнт не знайдений"));

        Equipment equipment = equipmentService.getOrCreate(dto.getEquipment());

        Claim claim = Claim.builder()
                .client(client)
                .equipment(equipment)
                .repairType(dto.getRepairType())
                .status(dto.getStatus())
                .defectDescription(dto.getDefectDescription())
                .totalTimeSpent(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .closedAt(null)
                .build();

        // якщо одразу завершена або скасована
        if (dto.getStatus() == Status.COMPLETED || dto.getStatus() == Status.CANCELED) {
            claim.setClosedAt(LocalDateTime.now());
        }

        claimRepository.save(claim);

        // EVENT: creatorEmployeeId = реальний працівник
        publishClaimCreatedEvent(claim, dto.getEmployeeId());

        return mapToResponse(claim);
    }

    @Transactional
    public ClaimResponseDTO updateDetails(Integer id, UpdateClaimDTO dto) {

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        if (!claimStatusMachine.allowsClaimEdit(claim.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "редагувати заявку", claim.getStatus(), claimStatusMachine.allowedClaimEditStatuses()
                    )
            );
        }

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new NotFoundException("Клієнт не знайдений"));

        Equipment equipment = equipmentService.getOrCreate(dto.getEquipment());

        boolean descriptionChanged =
                !Objects.equals(claim.getDefectDescription(), dto.getDefectDescription());

        claim.setClient(client);
        claim.setEquipment(equipment);
        claim.setRepairType(dto.getRepairType());
        claim.setDefectDescription(dto.getDefectDescription());

        claimRepository.save(claim);

        if (descriptionChanged && claimStatusMachine.allowsEmbeddingGeneration(claim.getStatus())) {
            eventPublisher.publishEvent(new ClaimDescriptionChangedEvent(claim.getId()));
        }

        return mapToResponse(claim);
    }

    public Set<Status> getAllowedNextStatuses(Integer claimId) {
        Status status = getClaimStatus(claimId);
        return claimStatusMachine.getAllowedNextStatuses(status);
    }

    @Transactional
    public ClaimResponseDTO changeStatus(Integer id, Integer employeeId, UpdateClaimStatusDTO dto) {

        Claim claim = getClaim(id);

        accessService.checkEmployeeCanWork(id, employeeId);

        Status currentStatus = claim.getStatus();
        Status newStatus = dto.getStatus();

        // якщо той самий статус — нічого не робимо
        if (currentStatus == newStatus) {
            return mapToResponse(claim);
        }

        // перевірка дозволеного переходу
        if (!claimStatusMachine.canTransition(currentStatus, newStatus)) {
            throw new InvalidStatusTransitionException("Недопустимий перехід статусу: " + currentStatus + " → " + newStatus);
        }

        if (newStatus == Status.COMPLETED && !canBeCompleted(id)) {
            throw new OperationNotAllowedException(
                    "Заявку не можна завершити: є незавершені роботи або неоплачений рахунок"
            );
        }

        claim.setStatus(newStatus);

        // керування closedAt
        if (newStatus == Status.COMPLETED || newStatus == Status.CANCELED) {
            claim.setClosedAt(LocalDateTime.now());
        } else {
            claim.setClosedAt(null);
        }

        claimRepository.save(claim);

        eventPublisher.publishEvent(
                new ClaimStatusChangedEvent(claim.getId(), employeeId, currentStatus, newStatus)
        );

        return mapToResponse(claim);
    }

    public ClaimResponseDTO getClaimById(Integer id) {
        return mapToResponse(getClaim(id));
    }

    public List<ClaimResponseDTO> getByClient(Integer clientId) {
        return claimRepository.findByClientId(clientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ClaimResponseDTO> getActiveClaims() {
        return claimRepository.findByClosedAtIsNull()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ClaimResponseDTO> getByStatus(Status status) {
        return claimRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Status getClaimStatus(Integer claimId) {
        return claimRepository.findById(claimId)
                .map(Claim::getStatus)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));
    }

    public List<ClaimResponseDTO> getAllClaims() {
        return claimRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ClaimShortDTO> getAllClaimsShort() {
        return claimRepository.findAll()
                .stream()
                .map(this::mapToShortDTO)
                .toList();
    }

    public void delete(Integer id) {
        if (!claimRepository.existsById(id)) {
            throw new NotFoundException("Заявка не знайдена");
        }
        claimRepository.deleteById(id);
    }

    public Claim getClaim(Integer id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));
    }

    private boolean canBeCompleted(Integer claimId) {

        // =========================
        // 1. INVOICE
        // =========================
        Invoice invoice = invoiceRepository.findByClaimId(claimId)
                .orElse(null);

        // якщо рахунку немає — не можна завершити
        if (invoice == null) {
            return false;
        }

        // або оплачений
        boolean invoicePaid =
                invoice.getStatus() == InvoiceStatus.PAID
                        || invoice.getTotalAmount().compareTo(BigDecimal.ZERO) == 0;

        if (!invoicePaid) {
            return false;
        }

        // =========================
        // 2. DELIVERY
        // =========================
        boolean hasActiveDelivery =
                deliveryRepository.findByClaimId(claimId).stream()
                        .anyMatch(d ->
                                d.getStatus() != DeliveryStatus.DELIVERED
                                        && d.getStatus() != DeliveryStatus.CANCELED
                        );

        if (hasActiveDelivery) {
            return false;
        }

        // =========================
        // 3. OK
        // =========================
        return true;
    }
    @Transactional
    public void tryCompleteClaim(Integer claimId) {

        Claim claim = getClaim(claimId);

        if (claim.getStatus() == Status.COMPLETED) {
            return;
        }

        if (!canBeCompleted(claimId)) {
            return;
        }

        claim.setStatus(Status.COMPLETED);
        claim.setClosedAt(LocalDateTime.now());

        claimRepository.save(claim);
    }

    private ClaimResponseDTO mapToResponse(Claim claim) {
        return ClaimResponseDTO.builder()
                .id(claim.getId())
                .clientId(claim.getClient().getId())
                .equipmentId(claim.getEquipment().getId())
                .repairType(claim.getRepairType())
                .status(claim.getStatus())
                .defectDescription(claim.getDefectDescription())
                .totalTimeSpent(claim.getTotalTimeSpent())
                .createdAt(claim.getCreatedAt())
                .closedAt(claim.getClosedAt())
                .build();
    }

    private ClaimShortDTO mapToShortDTO(Claim claim) {
        return new ClaimShortDTO(
                claim.getId(),
                claim.getEquipment().getModel().getModelName(),
                claim.getEquipment().getSerialNumber(),
                claim.getDefectDescription(),
                claim.getRepairType().name(),
                claim.getStatus().name(),
                claim.getCreatedAt()
        );
    }

    private void publishClaimCreatedEvent(Claim claim, Integer creatorEmployeeId) {
        eventPublisher.publishEvent(
                new ClaimCreatedEvent(
                        claim.getId(),
                        creatorEmployeeId,
                        claim.getClient().getId(),
                        claim.getRepairType(),
                        claim.getStatus()
                )
        );
    }
}
