package ua.nure.medirepairtrack.Controller.repair;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.CreateRepairWorkDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.RepairWorkResponseDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.UpdateRepairWorkDTO;
import ua.nure.medirepairtrack.Service.repair.RepairWorkService;

import java.util.List;

@RestController
@RequestMapping("/api/repair-works")
@RequiredArgsConstructor
public class RepairWorkController {

    private final RepairWorkService service;

    @PostMapping
    public RepairWorkResponseDTO create(@Valid @RequestBody CreateRepairWorkDTO dto, @RequestParam Integer employeeId) {
        return service.create(dto, employeeId);
    }

    @PutMapping("/{id}")
    public RepairWorkResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateRepairWorkDTO dto) {
        return service.update(id, dto);
    }

    @GetMapping("/{id}")
    public RepairWorkResponseDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping
    public List<RepairWorkResponseDTO> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

}