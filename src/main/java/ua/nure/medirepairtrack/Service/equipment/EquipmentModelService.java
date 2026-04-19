package ua.nure.medirepairtrack.Service.equipment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.CreateEquipmentModelDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.EquipmentModelResponseDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.EquipmentModelShortDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.UpdateEquipmentModelDTO;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentModel;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentType;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.equipment.EquipmentModelRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentModelService {

    private final EquipmentModelRepository equipmentModelRepository;

    @Transactional
    public EquipmentModelResponseDTO create(CreateEquipmentModelDTO dto) {
        EquipmentModel model = EquipmentModel.builder()
                .modelName(dto.getModelName())
                .manufacturer(dto.getManufacturer())
                .type(dto.getType())
                .releaseDate(dto.getReleaseDate())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .build();

        equipmentModelRepository.save(model);
        return map(model);
    }

    @Transactional
    public EquipmentModelResponseDTO update(Integer id, UpdateEquipmentModelDTO dto) {
        EquipmentModel model = equipmentModelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Модель обладнання не знайдена"));

        if (dto.getModelName() != null) model.setModelName(dto.getModelName());
        if (dto.getManufacturer() != null) model.setManufacturer(dto.getManufacturer());
        if (dto.getType() != null) model.setType(dto.getType());
        if (dto.getReleaseDate() != null) model.setReleaseDate(dto.getReleaseDate());
        if (dto.getDescription() != null) model.setDescription(dto.getDescription());

        model.setUpdatedAt(LocalDateTime.now());
        equipmentModelRepository.save(model);

        return map(model);
    }

    public EquipmentModelResponseDTO getById(Integer id) {
        return equipmentModelRepository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Модель обладнання не знайдена"));
    }

    public List<EquipmentModelResponseDTO> getAll() {
        return equipmentModelRepository.findAll().stream().map(this::map).toList();
    }

    public List<EquipmentModelShortDTO> getAllShort() {
        return equipmentModelRepository.findAll()
                .stream()
                .map(this::mapShort)
                .toList();
    }

    public List<EquipmentModelResponseDTO> searchByModelName(String modelName) {
        return equipmentModelRepository.findByModelNameContainingIgnoreCase(modelName)
                .stream().map(this::map).toList();
    }

    public List<EquipmentModelResponseDTO> searchByManufacturer(String manufacturer) {
        return equipmentModelRepository.findByManufacturerContainingIgnoreCase(manufacturer)
                .stream().map(this::map).toList();
    }

    public List<EquipmentModelResponseDTO> findByType(EquipmentType type) {
        return equipmentModelRepository.findByType(type)
                .stream().map(this::map).toList();
    }

    public void delete(Integer id) {
        if (!equipmentModelRepository.existsById(id))
            throw new NotFoundException("Модель обладнання не знайдена");

        equipmentModelRepository.deleteById(id);
    }

    private EquipmentModelResponseDTO map(EquipmentModel m) {
        return EquipmentModelResponseDTO.builder()
                .id(m.getId())
                .modelName(m.getModelName())
                .manufacturer(m.getManufacturer())
                .type(m.getType())
                .releaseDate(m.getReleaseDate())
                .description(m.getDescription())
                .createdAt(m.getCreatedAt())
                .updatedAt(m.getUpdatedAt())
                .build();
    }

    private EquipmentModelShortDTO mapShort(EquipmentModel m) {
        return EquipmentModelShortDTO.builder()
                .id(m.getId())
                .modelName(m.getModelName())
                .manufacturer(m.getManufacturer())
                .build();
    }
}