package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO.ComplexityLevelResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO.CreateComplexityLevelDTO;
import ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO.UpdateComplexityLevelDTO;
import ua.nure.medirepairtrack.Entity.DSS.ComplexityLevel;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.ComplexityLevelRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplexityLevelService {

    private final ComplexityLevelRepository repository;

    @Transactional
    public ComplexityLevelResponseDTO create(CreateComplexityLevelDTO dto) {

        ComplexityLevel entity = ComplexityLevel.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        return map(repository.save(entity));
    }

    @Transactional
    public ComplexityLevelResponseDTO update(Integer id, UpdateComplexityLevelDTO dto) {

        ComplexityLevel entity = getEntity(id);

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());

        return map(repository.save(entity));
    }

    public ComplexityLevelResponseDTO getById(Integer id) {
        return map(getEntity(id));
    }

    public List<ComplexityLevelResponseDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Transactional
    public void delete(Integer id) {
        ComplexityLevel entity = getEntity(id);
        repository.delete(entity);
    }

    public ComplexityLevel getEntity(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Рівень складності не знайдено"));
    }

    private ComplexityLevelResponseDTO map(ComplexityLevel e) {

        return ComplexityLevelResponseDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .description(e.getDescription())
                .build();
    }
}
