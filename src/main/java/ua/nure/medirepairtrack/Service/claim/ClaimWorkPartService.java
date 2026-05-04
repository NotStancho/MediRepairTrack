package ua.nure.medirepairtrack.Service.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO.ClaimWorkPartResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO.CreateClaimWorkPartDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO.UpdateClaimWorkPartQuantityDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.ClaimWork.ClaimWork;
import ua.nure.medirepairtrack.Entity.claim.ClaimWorkPart.ClaimWorkPart;
import ua.nure.medirepairtrack.Entity.claim.ClaimWorkPart.ClaimWorkPartId;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;
import ua.nure.medirepairtrack.Entity.repair.Part.UnitType;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartRemovedEvent;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartUpdatedEvent;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartAddedEvent;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.claim.ClaimWorkPartRepository;
import ua.nure.medirepairtrack.Repository.claim.ClaimWorkRepository;
import ua.nure.medirepairtrack.Repository.repair.PartRepository;
import ua.nure.medirepairtrack.Workflow.ClaimStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimWorkPartService {

    private final ClaimWorkPartRepository repository;
    private final ClaimWorkRepository claimWorkRepository;
    private final PartRepository partRepository;

    private final ClaimStatusMachine claimStatusMachine;
    private final ClaimAccessService accessService;

    private final ApplicationEventPublisher eventPublisher;

    /**
     * Додати запчастину до ремонтній роботі:
     * - списати зі складу
     * - створити/оновити claim_work_part (upsert)
     * - подія ClaimWorkPartAddedEvent (claim_history + billing)
     */
    @Transactional
    public ClaimWorkPartResponseDTO addPartToClaimWork(Integer claimWorkId, Integer employeeId, CreateClaimWorkPartDTO dto) {

        ClaimWork claimWork = claimWorkRepository.findById(claimWorkId)
                .orElseThrow(() -> new NotFoundException("Ремонтна робота не знайдена"));

        Claim claim = claimWork.getClaim();
        if (!claimStatusMachine.allowsPartUsage(claim.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("використати запчастини", claim.getStatus(), claimStatusMachine.allowedPartUsageStatuses()));
        }

        accessService.validateEmployeeOwnsClaimWork(claimWork, employeeId);

        Part part = partRepository.findById(dto.getPartId())
                .orElseThrow(() -> new NotFoundException("Запчастина не знайдена"));

        BigDecimal qty = dto.getQuantity();

        if (qty.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Кількість має бути > 0");
        }

        validateQuantityByUnitType(part, qty);

        // 1) списання зі складу
        if (part.getStockQuantity().compareTo(qty) < 0) {
            throw new BadRequestException("Недостатньо запчастин на складі. Доступно: " + part.getStockQuantity());
        }
        part.setStockQuantity(part.getStockQuantity().subtract(qty));
        part.setUpdatedAt(LocalDateTime.now());
        partRepository.save(part);

        // 2) upsert claim_work_part
        ClaimWorkPartId id = new ClaimWorkPartId(claimWorkId, part.getId());
        ClaimWorkPart claimWorkPart = repository.findById(id).orElse(null);

        if (claimWorkPart == null) {
            claimWorkPart = ClaimWorkPart.builder()
                    .id(id)
                    .claimWork(claimWork)
                    .part(part)
                    .quantity(qty)
                    .createdAt(LocalDateTime.now())
                    .build();
        } else {
            claimWorkPart.setQuantity(claimWorkPart.getQuantity().add(qty));
            claimWorkPart.setUpdatedAt(LocalDateTime.now());
        }

        repository.save(claimWorkPart);

        String repairWorkName = claimWork.getRepairWork().getName();

        // 3) подія: claim_history + billing
        eventPublisher.publishEvent(new ClaimWorkPartAddedEvent(
                claim.getId(),
                claimWork.getId(),
                repairWorkName,
                employeeId,
                part.getId(),
                part.getPartCode(),
                part.getPartName(),
                part.getUnitName(),
                part.getUnitType(),
                qty
        ));

        return map(claimWorkPart);
    }

    @Transactional
    public ClaimWorkPartResponseDTO updateClaimWorkPartQuantity(Integer claimWorkId, Integer employeeId, UpdateClaimWorkPartQuantityDTO dto) {

        ClaimWork claimWork = claimWorkRepository.findById(claimWorkId)
                .orElseThrow(() -> new NotFoundException("Ремонтна робота не знайдена"));

        Claim claim = claimWork.getClaim();
        if (!claimStatusMachine.allowsPartUsage(claim.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("корекція запчастин", claim.getStatus(), claimStatusMachine.allowedPartUsageStatuses()));
        }
        accessService.validateEmployeeOwnsClaimWork(claimWork, employeeId);

        ClaimWorkPartId id = new ClaimWorkPartId(claimWorkId, dto.getPartId());

        ClaimWorkPart claimWorkPart = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запчастина не використана у цій ремонтній роботі"));

        Part part = claimWorkPart.getPart();

        BigDecimal oldQty = claimWorkPart.getQuantity();
        BigDecimal newQty = dto.getNewQuantity();

        if (newQty.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Кількість має бути > 0");
        }

        validateQuantityByUnitType(part, newQty);
        BigDecimal delta = newQty.subtract(oldQty);

        if (delta.compareTo(BigDecimal.ZERO) == 0) {
            return map(claimWorkPart);
        }

        // delta > 0 → ще списуємо
        if (delta.compareTo(BigDecimal.ZERO) > 0) {

            if (part.getStockQuantity().compareTo(delta) < 0) {
                throw new BadRequestException("Недостатньо запчастин на складі для корекції. Доступно: " + part.getStockQuantity());
            }

            part.setStockQuantity(part.getStockQuantity().subtract(delta));
            part.setUpdatedAt(LocalDateTime.now());
            partRepository.save(part);
        }

        // delta < 0 → повертаємо на склад
        if (delta.compareTo(BigDecimal.ZERO) < 0) {
            part.setStockQuantity(part.getStockQuantity().add(delta.abs()));
            part.setUpdatedAt(LocalDateTime.now());
            partRepository.save(part);
        }

        claimWorkPart.setQuantity(newQty);
        claimWorkPart.setUpdatedAt(LocalDateTime.now());
        repository.save(claimWorkPart);

        String repairWorkName = claimWork.getRepairWork().getName();

        // EVENT
        eventPublisher.publishEvent(new ClaimWorkPartUpdatedEvent(
                claim.getId(),
                claimWork.getId(),
                repairWorkName,
                employeeId,
                part.getId(),
                part.getPartCode(),
                part.getPartName(),
                part.getUnitName(),
                part.getUnitType(),
                oldQty,
                newQty,
                delta
        ));

        return map(claimWorkPart);
    }

    @Transactional
    public void deleteClaimWorkPart(Integer claimWorkId, Integer employeeId, Integer partId) {
        ClaimWork claimWork = claimWorkRepository.findById(claimWorkId)
                .orElseThrow(() -> new NotFoundException("Ремонтна робота не знайдена"));

        Claim claim = claimWork.getClaim();

        if (!claimStatusMachine.allowsPartUsage(claim.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "видалити використану запчастину",
                            claim.getStatus(),
                            claimStatusMachine.allowedPartUsageStatuses()
                    )
            );
        }

        accessService.validateEmployeeOwnsClaimWork(claimWork, employeeId);

        ClaimWorkPartId id = new ClaimWorkPartId(claimWorkId, partId);

        ClaimWorkPart claimWorkPart = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запчастина не використана у цій ремонтній роботі"));

        Part part = claimWorkPart.getPart();
        BigDecimal oldQty = claimWorkPart.getQuantity();

        part.setStockQuantity(part.getStockQuantity().add(oldQty));
        part.setUpdatedAt(LocalDateTime.now());
        partRepository.save(part);

        repository.delete(claimWorkPart);

        String repairWorkName = claimWork.getRepairWork().getName();

        eventPublisher.publishEvent(new ClaimWorkPartRemovedEvent(
                claim.getId(),
                claimWork.getId(),
                repairWorkName,
                employeeId,
                part.getId(),
                part.getPartCode(),
                part.getPartName(),
                part.getUnitName(),
                part.getUnitType(),
                oldQty
        ));
    }

    public List<ClaimWorkPartResponseDTO> getPartsByClaimWork(Integer claimWorkId) {
        if (!claimWorkRepository.existsById(claimWorkId)) {
            throw new NotFoundException("Ремонтна робота не знайдена");
        }

        return repository.findByIdClaimWorkId(claimWorkId).stream()
                .map(this::map)
                .toList();
    }

    public List<ClaimWorkPartResponseDTO> getPartsByClaim(Integer claimId) {
        return repository.findByClaimWorkClaimId(claimId)
                .stream()
                .map(this::map)
                .toList();
    }

    private void validateQuantityByUnitType(Part part, BigDecimal qty) {
        if (part.getUnitType() == UnitType.PIECE) {
            if (qty.scale() > 0 && qty.remainder(BigDecimal.ONE).compareTo(BigDecimal.ZERO) != 0) {
                throw new BadRequestException(
                        String.format(
                                "Некоректна кількість %.3f для одиниці '%s'. Тип одиниці PIECE дозволяє лише цілі значення (1, 2, 3...).",
                                qty,
                                part.getUnitName()
                        )
                );
            }
        }
    }

    private ClaimWorkPartResponseDTO map(ClaimWorkPart claimWorkPart) {
        Part p = claimWorkPart.getPart();

        return ClaimWorkPartResponseDTO.builder()
                .claimWorkId(claimWorkPart.getId().getClaimWorkId())
                .partId(p.getId())
                .partCode(p.getPartCode())
                .partName(p.getPartName())
                .quantity(claimWorkPart.getQuantity())
                .unitPrice(p.getPrice())
                .unitName(p.getUnitName())
                .createdAt(claimWorkPart.getCreatedAt())
                .updatedAt(claimWorkPart.getUpdatedAt())
                .build();
    }
}
