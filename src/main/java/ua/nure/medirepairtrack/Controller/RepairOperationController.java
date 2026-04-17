package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.RepairOperation.CreateRepairOperationDTO;
import ua.nure.medirepairtrack.DTO.RepairOperation.RepairOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.RepairOperation.UpdateRepairOperationDTO;
import ua.nure.medirepairtrack.Service.RepairOperationService;

import java.util.List;

@RestController
@RequestMapping("/api/repair-operations")
@RequiredArgsConstructor
public class RepairOperationController {

    private final RepairOperationService service;

    @PostMapping
    public RepairOperationResponseDTO create(@Valid @RequestBody CreateRepairOperationDTO dto, @RequestParam Integer employeeId) {
        return service.create(dto, employeeId);
    }

    @PutMapping("/{id}")
    public RepairOperationResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateRepairOperationDTO dto) {
        return service.update(id, dto);
    }

    @GetMapping("/{id}")
    public RepairOperationResponseDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping
    public List<RepairOperationResponseDTO> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

}