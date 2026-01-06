package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.EquipmentDTO.CreateEquipmentDTO;
import ua.nure.medirepairtrack.DTO.EquipmentDTO.EquipmentFullResponseDTO;
import ua.nure.medirepairtrack.DTO.EquipmentDTO.EquipmentResponseDTO;
import ua.nure.medirepairtrack.DTO.EquipmentDTO.UpdateEquipmentDTO;
import ua.nure.medirepairtrack.DTO.EquipmentDTO.*;
import ua.nure.medirepairtrack.Entity.Equipment.Equipment;
import ua.nure.medirepairtrack.Entity.EquipmentModel.EquipmentModel;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.EquipmentModelRepository;
import ua.nure.medirepairtrack.Repository.EquipmentRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentModelRepository equipmentModelRepository;

    @Transactional
    public EquipmentResponseDTO create(CreateEquipmentDTO dto) {
        EquipmentModel model = equipmentModelRepository.findById(dto.getModelId())
                .orElseThrow(() -> new NotFoundException("Модель обладнання не знайдена"));

        // швидка бізнес-перевірка (і все одно є захист у БД через unique)
        if (equipmentRepository.existsByModelIdAndSerialNumber(dto.getModelId(), dto.getSerialNumber())) {
            throw new BadRequestException("Такий serial_number вже існує в межах цієї моделі");
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
        // Спробувати знайти існуюче обладнання
        return equipmentRepository
                .findByModelIdAndSerialNumber(dto.getModelId(), dto.getSerialNumber())
                .orElseGet(() -> {

                    // Якщо не існує — створюємо
                    EquipmentResponseDTO created = create(dto);

                    // Повертаємо entity (потрібно ClaimService)
                    return equipmentRepository.findById(created.getId())
                            .orElseThrow(() ->
                                    new IllegalStateException("Не вдалося отримати щойно створене обладнання")
                            );
                });
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
                .orElseThrow(() -> new NotFoundException("Обладнання не знайдено для цієї моделі та serial_number"));
    }

    public void delete(Integer id) {
        if (!equipmentRepository.existsById(id))
            throw new NotFoundException("Обладнання не знайдено");

        equipmentRepository.deleteById(id);
    }

    private EquipmentResponseDTO map(Equipment e) {
        return EquipmentResponseDTO.builder()
                .id(e.getId())
                .serialNumber(e.getSerialNumber())
                .purchaseDate(e.getPurchaseDate())
                .price(e.getPrice())
                .description(e.getDescription())
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

                // model
                .modelName(m.getModelName())
                .manufacturer(m.getManufacturer())
                .equipmentType(m.getType())
                .releaseDate(m.getReleaseDate())
                .descriptionModel(m.getDescription())
                .build();
    }
}
