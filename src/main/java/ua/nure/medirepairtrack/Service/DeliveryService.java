package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DeliveryDTO.*;
import ua.nure.medirepairtrack.Entity.Delivery.Delivery;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryProvider;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryStatus;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryType;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryCreatedEvent;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryDeletedEvent;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryStatusChangedEvent;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryUpdatedEvent;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.InvalidStatusTransitionException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.DTO.DeliveryDTO.*;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.Delivery.*;
import ua.nure.medirepairtrack.Event.Delivery.*;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.ClaimRepository;
import ua.nure.medirepairtrack.Repository.DeliveryRepository;
import ua.nure.medirepairtrack.Workflow.ClaimStatusMachine;
import ua.nure.medirepairtrack.Workflow.DeliveryStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final ClaimRepository claimRepository;

    private final ClaimStatusMachine claimStatusMachine;
    private final DeliveryStatusMachine deliveryStatusMachine;

    private final ClaimAccessService accessService;

    private final ApplicationEventPublisher eventPublisher;

    // =========================
    // CREATE — ENGINEER TRIP
    // =========================
    @Transactional
    public DeliveryResponseDTO createEngineerTrip(Integer employeeId, CreateEngineerDeliveryDTO dto) {

        Claim claim = getClaimForDelivery(dto.getClaimId(), employeeId);

        Delivery delivery = Delivery.builder()
                .claim(claim)
                .type(DeliveryType.ENGINEER_ON_SITE)
                .provider(DeliveryProvider.ENGINEER)
                .status(DeliveryStatus.CREATED)
                .distanceKm(dto.getDistanceKm())
                .pricePerUnit(dto.getPricePerUnit())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .build();

        deliveryRepository.save(delivery);

        publishCreatedEvent(delivery, employeeId);

        return map(delivery);
    }

    // =========================
    // CREATE — POSTAL
    // =========================
    @Transactional
    public DeliveryResponseDTO createPostalDelivery(Integer employeeId, CreatePostalDeliveryDTO dto) {

        Claim claim = getClaimForDelivery(dto.getClaimId(), employeeId);

        Delivery delivery = Delivery.builder()
                .claim(claim)
                .type(dto.getType())
                .provider(dto.getProvider())
                .status(DeliveryStatus.CREATED)
                .price(dto.getPrice())
                .trackingCode(dto.getTrackingCode())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .build();

        deliveryRepository.save(delivery);

        publishCreatedEvent(delivery, employeeId);

        return map(delivery);
    }

    // =========================
    // UPDATE — ENGINEER
    // =========================
    @Transactional
    public DeliveryResponseDTO updateEngineerDelivery(Integer id, Integer employeeId, UpdateEngineerDeliveryDTO dto) {

        Delivery delivery = getEditableDelivery(id, employeeId);

        if (delivery.getType() != DeliveryType.ENGINEER_ON_SITE) {
            throw new BadRequestException("Це не доставка типу ENGINEER_ON_SITE");
        }

        delivery.setDistanceKm(dto.getDistanceKm());
        delivery.setPricePerUnit(dto.getPricePerUnit());
        delivery.setDescription(dto.getDescription());
        delivery.setUpdatedAt(LocalDateTime.now());

        publishUpdatedEvent(delivery, employeeId);

        return map(delivery);
    }

    // =========================
    // UPDATE — POSTAL
    // =========================
    @Transactional
    public DeliveryResponseDTO updatePostalDelivery(
            Integer id,
            Integer employeeId,
            UpdatePostalDeliveryDTO dto
    ) {

        Delivery delivery = getEditableDelivery(id, employeeId);

        if (delivery.getType() == DeliveryType.ENGINEER_ON_SITE) {
            throw new BadRequestException("ENGINEER_ON_SITE має окремий endpoint");
        }

        delivery.setPrice(dto.getPrice());
        delivery.setTrackingCode(dto.getTrackingCode());
        delivery.setDescription(dto.getDescription());
        delivery.setUpdatedAt(LocalDateTime.now());

        publishUpdatedEvent(delivery, employeeId);

        return map(delivery);
    }

    // =========================
    // CHANGE STATUS
    // =========================
    @Transactional
    public DeliveryResponseDTO changeDeliveryStatus(
            Integer id,
            Integer employeeId,
            UpdateDeliveryStatusDTO dto
    ) {

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Доставка не знайдена"));

        accessService.checkEmployeeCanWork(
                delivery.getClaim().getId(),
                employeeId
        );

        DeliveryStatus current = delivery.getStatus();
        DeliveryStatus next = dto.getStatus();

        if (current == next) {
            return map(delivery);
        }

        if (!deliveryStatusMachine.canTransition(current, next)) {
            throw new InvalidStatusTransitionException(
                    "Недопустимий перехід статусу доставки: "
                            + current + " → " + next
            );
        }

        delivery.setStatus(next);
        delivery.setUpdatedAt(LocalDateTime.now());

        if (next == DeliveryStatus.DELIVERED) {
            delivery.setPerformedAt(LocalDateTime.now());
        }

        eventPublisher.publishEvent(
                new DeliveryStatusChangedEvent(
                        delivery.getClaim().getId(),
                        delivery.getId(),
                        employeeId,
                        current,
                        next
                )
        );

        return map(delivery);
    }

    // =========================
    // DELETE
    // =========================
    @Transactional
    public void delete(Integer id, Integer employeeId) {

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Доставка не знайдена"));

        accessService.checkEmployeeCanWork(
                delivery.getClaim().getId(),
                employeeId
        );

        if (!deliveryStatusMachine.allowsDelete(delivery.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("видалити доставку", delivery.getStatus(), deliveryStatusMachine.allowedDeleteStatuses()));
        }

        deliveryRepository.delete(delivery);

        eventPublisher.publishEvent(
                new DeliveryDeletedEvent(
                        delivery.getClaim().getId(),
                        delivery.getId(),
                        employeeId,
                        delivery.getType(),
                        delivery.getProvider()
                )
        );
    }

    // =========================
    // READ
    // =========================
    public DeliveryResponseDTO getById(Integer id) {
        return deliveryRepository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Доставка не знайдена"));
    }

    public List<DeliveryResponseDTO> getByClaim(Integer claimId) {
        return deliveryRepository.findByClaimId(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    public Set<DeliveryStatus> getAllowedNextStatuses(Integer deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new NotFoundException("Доставка не знайдена"));
        return deliveryStatusMachine.getAllowedNextStatuses(delivery.getStatus());
    }

    // =========================
    // INTERNAL UTIL
    // =========================
    private Claim getClaimForDelivery(Integer claimId, Integer employeeId) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        if (!claimStatusMachine.allowsDelivery(claim.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("створити доставку", claim.getStatus(), claimStatusMachine.allowedDeliveryStatuses()));
        }

        accessService.checkEmployeeCanWork(claimId, employeeId);

        return claim;
    }

    private Delivery getEditableDelivery(Integer id, Integer employeeId) {

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Доставка не знайдена"));

        accessService.checkEmployeeCanWork(delivery.getClaim().getId(), employeeId);

        if (!deliveryStatusMachine.allowsUpdate(delivery.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("оновити доставку", delivery.getStatus(), deliveryStatusMachine.allowedUpdateStatuses()));
        }

        return delivery;
    }

    private void publishCreatedEvent(Delivery d, Integer employeeId) {
        eventPublisher.publishEvent(
                new DeliveryCreatedEvent(
                        d.getClaim().getId(),
                        d.getId(),
                        employeeId,
                        d.getType(),
                        d.getProvider(),
                        d.getStatus(),
                        d.getTrackingCode(),
                        d.getDistanceKm(),
                        d.getPricePerUnit(),
                        d.getPrice()
                )
        );
    }

    private void publishUpdatedEvent(Delivery d, Integer employeeId) {
        eventPublisher.publishEvent(
                new DeliveryUpdatedEvent(
                        d.getClaim().getId(),
                        d.getId(),
                        employeeId,
                        d.getType(),
                        d.getProvider(),
                        d.getTrackingCode(),
                        d.getDistanceKm(),
                        d.getPricePerUnit(),
                        d.getPrice()
                )
        );
    }

    private DeliveryResponseDTO map(Delivery d) {
        return DeliveryResponseDTO.builder()
                .id(d.getId())
                .claimId(d.getClaim().getId())
                .type(d.getType())
                .provider(d.getProvider())
                .status(d.getStatus())
                .trackingCode(d.getTrackingCode())
                .distanceKm(d.getDistanceKm())
                .pricePerUnit(d.getPricePerUnit())
                .price(d.getPrice())
                .description(d.getDescription())
                .build();
    }
}