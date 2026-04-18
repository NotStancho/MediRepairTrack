package ua.nure.medirepairtrack.Service.repair;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.UsedPartDTO.UpdateUsedPartQuantityDTO;
import ua.nure.medirepairtrack.DTO.claim.UsedPartDTO.UsePartDTO;
import ua.nure.medirepairtrack.DTO.claim.UsedPartDTO.UsedPartResponseDTO;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.*;
import ua.nure.medirepairtrack.Entity.claim.UsedPart.UsedPart;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;
import ua.nure.medirepairtrack.Entity.repair.Part.UnitType;
import ua.nure.medirepairtrack.Entity.repair.Part.UsedPartId;
import ua.nure.medirepairtrack.Event.Part.*;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.claim.ClaimRepository;
import ua.nure.medirepairtrack.Repository.repair.PartRepository;
import ua.nure.medirepairtrack.Repository.claim.UsedPartRepository;
import ua.nure.medirepairtrack.Service.claim.ClaimAccessService;
import ua.nure.medirepairtrack.Workflow.ClaimStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartService {

    private final PartRepository partRepository;
    private final UsedPartRepository usedPartRepository;
    private final ClaimRepository claimRepository;

    private final ClaimStatusMachine claimStatusMachine;
    private final ClaimAccessService accessService;

    private final ApplicationEventPublisher eventPublisher;

    // -------------------- PART CRUD --------------------

    @Transactional
    public PartResponseDTO create(CreatePartDTO dto) {
        if (partRepository.existsByPartCode(dto.getPartCode())) {
            throw new BadRequestException("Запчастина з таким part_code вже існує");
        }

        Part part = Part.builder()
                .supplierName(dto.getSupplierName())
                .partCode(dto.getPartCode())
                .partName(dto.getPartName())
                .stockQuantity(dto.getStockQuantity())
                .price(dto.getPrice())
                .unitName(dto.getUnitName())
                .unitType(dto.getUnitType())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .updatedAt(null)
                .build();

        validateQuantityByUnitType(part, dto.getStockQuantity());

        partRepository.save(part);
        return mapPart(part);
    }

    @Transactional
    public PartResponseDTO update(Integer partId, UpdatePartDTO dto) {

        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new NotFoundException("Запчастина не знайдена"));

        part.setSupplierName(dto.getSupplierName());
        part.setPartName(dto.getPartName());
        part.setPrice(dto.getPrice());
        part.setUnitName(dto.getUnitName());
        part.setUnitType(dto.getUnitType());
        part.setDescription(dto.getDescription());
        part.setUpdatedAt(LocalDateTime.now());

        partRepository.save(part);
        return mapPart(part);
    }

    public PartResponseDTO getById(Integer partId) {
        return partRepository.findById(partId)
                .map(this::mapPart)
                .orElseThrow(() -> new NotFoundException("Запчастина не знайдена"));
    }

    public List<PartResponseDTO> getAll() {
        return partRepository.findAll().stream().map(this::mapPart).toList();
    }

    public List<PartShortDTO> getAllPartsShort() {
        return partRepository.findAll().stream()
                .map(this::mapPartShort)
                .toList();
    }

    @Transactional
    public void delete(Integer partId) {
        if (!partRepository.existsById(partId)) {
            throw new NotFoundException("Запчастина не знайдена");
        }
        // якщо треба — можна перевірити used_part, але FK RESTRICT і так зупинить
        partRepository.deleteById(partId);
    }

    // -------------------- STOCK --------------------

    @Transactional
    public PartResponseDTO addStock(Integer partId, AddStockDTO dto) {
        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new NotFoundException("Запчастина не знайдена"));

        if (dto.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Кількість для додавання має бути > 0");
        }

        validateQuantityByUnitType(part, dto.getQuantity());

        part.setStockQuantity(part.getStockQuantity().add(dto.getQuantity()));
        part.setUpdatedAt(LocalDateTime.now());

        partRepository.save(part);
        return mapPart(part);
    }

    // -------------------- USE PART IN CLAIM --------------------

    /**
     * Використати запчастину у заявці:
     * - списати зі складу
     * - записати/оновити used_part (upsert)
     * - подія PartUsedEvent (claim_history + billing)
     */
    @Transactional
    public UsedPartResponseDTO usePart(Integer claimId, Integer employeeId, UsePartDTO dto) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        if (!claimStatusMachine.allowsPartUsage(claim.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("використати запчастини", claim.getStatus(), claimStatusMachine.allowedPartUsageStatuses()));
        }

        accessService.checkEmployeeCanWork(claimId, employeeId);

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

        // 2) upsert used_part
        UsedPartId id = new UsedPartId(claimId, part.getId());
        UsedPart used = usedPartRepository.findById(id).orElse(null);

        if (used == null) {
            used = UsedPart.builder()
                    .id(id)
                    .claim(claim)
                    .part(part)
                    .quantity(qty)
                    .build();
        } else {
            used.setQuantity(used.getQuantity().add(qty));
        }

        usedPartRepository.save(used);

        // 3) подія: claim_history + billing
        eventPublisher.publishEvent(new PartUsedAddedEvent(
                claimId,
                employeeId,
                part.getId(),
                part.getPartCode(),
                part.getPartName(),
                part.getUnitName(),
                part.getUnitType(),
                qty,
                part.getPrice()
        ));

        return mapUsed(used, part.getPrice());
    }

    @Transactional
    public UsedPartResponseDTO updateUsedPartQuantity(Integer claimId, Integer employeeId, UpdateUsedPartQuantityDTO dto) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        if (!claimStatusMachine.allowsPartUsage(claim.getStatus())) {
            throw new OperationNotAllowedException(StatusMessageUtil.denied("корекція запчастин", claim.getStatus(), claimStatusMachine.allowedPartUsageStatuses()));
        }

        accessService.checkEmployeeCanWork(claimId, employeeId);

        UsedPartId id = new UsedPartId(claimId, dto.getPartId());

        UsedPart used = usedPartRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запчастина не використана у цій заявці"));

        Part part = used.getPart();

        BigDecimal oldQty = used.getQuantity();
        BigDecimal newQty = dto.getNewQuantity();

        if (newQty.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Кількість не може бути відʼємною");
        }

        validateQuantityByUnitType(part, newQty);

        BigDecimal delta = newQty.subtract(oldQty);

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

        // newQty == 0 → видаляємо used_part
        if (newQty.compareTo(BigDecimal.ZERO) == 0) {
            usedPartRepository.delete(used);
        } else {
            used.setQuantity(newQty);
            usedPartRepository.save(used);
        }

        BigDecimal unitPrice = part.getPrice();

        // EVENT
        eventPublisher.publishEvent(new PartUsageUpdatedEvent(
                claimId,
                employeeId,
                part.getId(),
                part.getPartCode(),
                part.getPartName(),
                part.getUnitName(),
                part.getUnitType(),
                oldQty,
                newQty,
                delta,
                unitPrice
        ));

        return UsedPartResponseDTO.builder()
                .claimId(claimId)
                .partId(part.getId())
                .partCode(part.getPartCode())
                .partName(part.getPartName())
                .quantity(newQty)
                .unitPrice(unitPrice)
                .unitName(part.getUnitName())
                .build();
    }


    public List<UsedPartResponseDTO> getUsedPartsByClaim(Integer claimId) {
        // optional: перевірити, що claim існує
        if (!claimRepository.existsById(claimId)) {
            throw new NotFoundException("Заявка не знайдена");
        }

        return usedPartRepository.findByIdClaimId(claimId).stream()
                .map(up -> {
                    Part p = up.getPart();
                    return mapUsed(up, p.getPrice());
                })
                .toList();
    }

    public Part getPartEntity(Integer partId) {
        return partRepository.findById(partId)
                .orElseThrow(() -> new NotFoundException("Запчастина не знайдена"));
    }

    // -------------------- helpers --------------------

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

    private PartResponseDTO mapPart(Part p) {
        return PartResponseDTO.builder()
                .id(p.getId())
                .supplierName(p.getSupplierName())
                .partCode(p.getPartCode())
                .partName(p.getPartName())
                .stockQuantity(p.getStockQuantity())
                .price(p.getPrice())
                .unitName(p.getUnitName())
                .unitType(p.getUnitType())
                .description(p.getDescription())
                .build();
    }

    private PartShortDTO mapPartShort(Part p) {
        return PartShortDTO.builder()
                .id(p.getId())
                .partCode(p.getPartCode())
                .partName(p.getPartName())
                .price(p.getPrice())
                .unitName(p.getUnitName())
                .build();
    }

    private UsedPartResponseDTO mapUsed(UsedPart up, BigDecimal unitPrice) {
        Part p = up.getPart();
        return UsedPartResponseDTO.builder()
                .claimId(up.getId().getClaimId())
                .partId(p.getId())
                .partCode(p.getPartCode())
                .partName(p.getPartName())
                .quantity(up.getQuantity())
                .unitPrice(unitPrice)
                .unitName(p.getUnitName())
                .build();
    }
}
