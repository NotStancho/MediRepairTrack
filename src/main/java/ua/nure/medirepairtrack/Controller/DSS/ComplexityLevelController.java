package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO.ComplexityLevelResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO.CreateComplexityLevelDTO;
import ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO.UpdateComplexityLevelDTO;
import ua.nure.medirepairtrack.Service.DSS.ComplexityLevelService;

import java.util.List;

@RestController
@RequestMapping("/api/complexity-levels")
@RequiredArgsConstructor
public class ComplexityLevelController {

    private final ComplexityLevelService service;

    @PostMapping
    public ComplexityLevelResponseDTO create(@Valid @RequestBody CreateComplexityLevelDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ComplexityLevelResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateComplexityLevelDTO dto) {
        return service.update(id, dto);
    }

    @GetMapping("/{id}")
    public ComplexityLevelResponseDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping
    public List<ComplexityLevelResponseDTO> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
