package ua.nure.medirepairtrack.Service.repair;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.*;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;
import ua.nure.medirepairtrack.Entity.repair.Part.UnitType;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.repair.PartRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartService {

    private final PartRepository partRepository;

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
        // якщо треба — можна перевірити claim_work_part, але FK RESTRICT і так зупинить
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


    // -------------------- helpers --------------------

    public Part getPartEntity(Integer partId) {
        return partRepository.findById(partId)
                .orElseThrow(() -> new NotFoundException("Запчастина не знайдена"));
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
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private PartShortDTO mapPartShort(Part p) {
        return PartShortDTO.builder()
                .id(p.getId())
                .partCode(p.getPartCode())
                .partName(p.getPartName())
                .stockQuantity(p.getStockQuantity())
                .price(p.getPrice())
                .unitName(p.getUnitName())
                .unitType(p.getUnitType())
                .build();
    }
}
