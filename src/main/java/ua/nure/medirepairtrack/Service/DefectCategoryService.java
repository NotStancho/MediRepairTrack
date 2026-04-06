package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DefectCategoryDTO.CreateDefectCategoryDTO;
import ua.nure.medirepairtrack.DTO.DefectCategoryDTO.DefectCategoryResponseDTO;
import ua.nure.medirepairtrack.DTO.DefectCategoryDTO.DefectCategoryShortResponseDTO;
import ua.nure.medirepairtrack.DTO.DefectCategoryDTO.UpdateDefectCategoryDTO;
import ua.nure.medirepairtrack.Entity.DefectCategory.DefectCategory;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DefectCategoryRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DefectCategoryService {

    private final DefectCategoryRepository repository;

    @Transactional
    public DefectCategoryResponseDTO create(CreateDefectCategoryDTO dto) {

        DefectCategory entity = DefectCategory.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .typicalSymptoms(dto.getTypicalSymptoms())
                .createdAt(LocalDateTime.now())
                .build();

        return map(repository.save(entity));
    }

    @Transactional
    public DefectCategoryResponseDTO update(Integer id, UpdateDefectCategoryDTO dto) {

        DefectCategory entity = getEntity(id);

        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription());
        }

        if (dto.getTypicalSymptoms() != null) {
            entity.setTypicalSymptoms(dto.getTypicalSymptoms());
        }

        entity.setUpdatedAt(LocalDateTime.now());

        return map(repository.save(entity));
    }

    public List<DefectCategoryResponseDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public List<DefectCategoryShortResponseDTO> getAllDefectCategoryShort() {
        return repository.findAll()
                .stream()
                .map(this::mapShort)
                .toList();
    }

    public DefectCategory getEntity(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Категорію дефекту не знайдено"));
    }

    private DefectCategoryResponseDTO map(DefectCategory e) {

        return DefectCategoryResponseDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .description(e.getDescription())
                .typicalSymptoms(e.getTypicalSymptoms())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private DefectCategoryShortResponseDTO mapShort (DefectCategory e) {
        return DefectCategoryShortResponseDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .typicalSymptoms(e.getTypicalSymptoms())
                .build();
    }
}
