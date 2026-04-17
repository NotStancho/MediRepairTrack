package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO.ComplexityLevelResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.ComplexityLevelDTO.CreateComplexityLevelDTO;
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

    @GetMapping
    public List<ComplexityLevelResponseDTO> getAll() {
        return service.getAll();
    }
}
