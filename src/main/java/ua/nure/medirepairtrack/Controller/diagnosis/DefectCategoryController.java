package ua.nure.medirepairtrack.Controller.diagnosis;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.diagnosis.DefectCategoryDTO.CreateDefectCategoryDTO;
import ua.nure.medirepairtrack.DTO.diagnosis.DefectCategoryDTO.DefectCategoryResponseDTO;
import ua.nure.medirepairtrack.DTO.diagnosis.DefectCategoryDTO.UpdateDefectCategoryDTO;
import ua.nure.medirepairtrack.Service.diagnosis.DefectCategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/defect-categories")
@RequiredArgsConstructor
public class DefectCategoryController {

    private final DefectCategoryService service;

    @PostMapping
    public DefectCategoryResponseDTO create(@Valid @RequestBody CreateDefectCategoryDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public DefectCategoryResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateDefectCategoryDTO dto) {
        return service.update(id, dto);
    }

    @GetMapping("/{id}")
    public DefectCategoryResponseDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping
    public List<DefectCategoryResponseDTO> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
