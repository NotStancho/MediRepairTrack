package ua.nure.medirepairtrack.Service.equipment;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.CreateEquipmentDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.EquipmentFullResponseDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.EquipmentResponseDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.UpdateEquipmentDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.EquipmentModelShortDTO;
import ua.nure.medirepairtrack.Entity.equipment.Equipment.Equipment;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentModel;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.equipment.EquipmentModelRepository;
import ua.nure.medirepairtrack.Repository.equipment.EquipmentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentModelRepository equipmentModelRepository;

    @Transactional
    public EquipmentResponseDTO create(CreateEquipmentDTO dto) {
        if (dto.getPurchaseDate() == null || dto.getPrice() == null) {
            throw new BadRequestException("Дата купівлі та ціна обовʼязкові");
        }

        EquipmentModel model = equipmentModelRepository.findById(dto.getModelId())
                .orElseThrow(() -> new NotFoundException("Модель обладнання не знайдена"));

        // швидка бізнес-перевірка (і все одно є захист у БД через unique)
        if (equipmentRepository.existsByModelIdAndSerialNumber(dto.getModelId(), dto.getSerialNumber())) {
            throw new BadRequestException("Обладнання з таким серійним номером вже існує в межах цієї моделі");
        }

        Equipment eq = Equipment.builder()
                .model(model)
                .serialNumber(dto.getSerialNumber())
                .purchaseDate(dto.getPurchaseDate())
                .price(dto.getPrice())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .build();

        equipmentRepository.save(eq);

        return map(eq);
    }

    @Transactional
    public Equipment getOrCreate(CreateEquipmentDTO dto) {
        // 1. Якщо обладнання вже існує — просто повертаємо
        Optional<Equipment> existing = equipmentRepository
                .findByModelIdAndSerialNumber(dto.getModelId(), dto.getSerialNumber());

        if (existing.isPresent()) {
            return existing.get();
        }

        // 2. Якщо НОВЕ — перевіряємо бізнес-умови
        if (dto.getPurchaseDate() == null || dto.getPrice() == null) {
            throw new BadRequestException("Для нового обладнання обовʼязкові дата купівлі та ціна");
        }

        EquipmentModel model = equipmentModelRepository.findById(dto.getModelId())
                .orElseThrow(() -> new NotFoundException("Модель обладнання не знайдена"));

        Equipment equipment = Equipment.builder()
                .model(model)
                .serialNumber(dto.getSerialNumber())
                .purchaseDate(dto.getPurchaseDate())
                .price(dto.getPrice())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .build();

        return equipmentRepository.save(equipment);
    }

    @Transactional
    public EquipmentResponseDTO update(Integer id, UpdateEquipmentDTO dto) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Обладнання не знайдено"));

        EquipmentModel model = equipmentModelRepository.findById(dto.getModelId())
                .orElseThrow(() -> new NotFoundException("Модель обладнання не знайдена"));

        eq.setModel(model);
        eq.setSerialNumber(dto.getSerialNumber());
        eq.setPurchaseDate(dto.getPurchaseDate());
        eq.setPrice(dto.getPrice());
        eq.setDescription(dto.getDescription());
        eq.setUpdatedAt(LocalDateTime.now());

        try {
            equipmentRepository.save(eq);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Конфлікт унікальності: serial_number вже існує в межах цієї моделі");
        }

        return map(eq);
    }

    public EquipmentResponseDTO getById(Integer id) {
        return equipmentRepository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Обладнання не знайдено"));
    }

    public EquipmentFullResponseDTO getFullById(Integer id) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Обладнання не знайдено"));

        return mapFull(eq);
    }

    public List<EquipmentResponseDTO> getAll() {
        return equipmentRepository.findAll().stream().map(this::map).toList();
    }

    public List<EquipmentResponseDTO> getByModel(Integer modelId) {
        return equipmentRepository.findByModelId(modelId)
                .stream().map(this::map).toList();
    }

    public EquipmentResponseDTO getByModelAndSerial(Integer modelId, String serialNumber) {
        return equipmentRepository.findByModelIdAndSerialNumber(modelId, serialNumber)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Обладнання з таким серійним номером для обраної моделі не знайдено"));
    }

    public void delete(Integer id) {
        if (!equipmentRepository.existsById(id))
            throw new NotFoundException("Обладнання не знайдено");

        equipmentRepository.deleteById(id);
    }

    private EquipmentResponseDTO map(Equipment e) {
        EquipmentModel m = e.getModel();

        return EquipmentResponseDTO.builder()
                .id(e.getId())
                .model(EquipmentModelShortDTO.builder()
                        .id(m.getId())
                        .modelName(m.getModelName())
                        .manufacturer(m.getManufacturer())
                        .build()
                )
                .serialNumber(e.getSerialNumber())
                .purchaseDate(e.getPurchaseDate())
                .price(e.getPrice())
                .description(e.getDescription())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private EquipmentFullResponseDTO mapFull(Equipment e) {
        EquipmentModel m = e.getModel();

        return EquipmentFullResponseDTO.builder()
                // equipment
                .id(e.getId())
                .serialNumber(e.getSerialNumber())
                .purchaseDate(e.getPurchaseDate())
                .price(e.getPrice())
                .description(e.getDescription())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())

                // model
                .modelName(m.getModelName())
                .manufacturer(m.getManufacturer())
                .equipmentType(m.getType())
                .releaseDate(m.getReleaseDate())
                .descriptionModel(m.getDescription())
                .build();
    }
}
