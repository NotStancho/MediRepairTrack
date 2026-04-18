package ua.nure.medirepairtrack.Controller.equipment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.CreateEquipmentDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.EquipmentFullResponseDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.EquipmentResponseDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentDTO.UpdateEquipmentDTO;
import ua.nure.medirepairtrack.Service.equipment.EquipmentService;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping
    public EquipmentResponseDTO create(@Valid @RequestBody CreateEquipmentDTO dto) {
        return equipmentService.create(dto);
    }

    @PutMapping("/{id}")
    public EquipmentResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateEquipmentDTO dto) {
        return equipmentService.update(id, dto);
    }

    @GetMapping("/{id}")
    public EquipmentResponseDTO getById(@PathVariable Integer id) {
        return equipmentService.getById(id);
    }

    @GetMapping("/{id}/full")
    public EquipmentFullResponseDTO getFull(@PathVariable Integer id) {
        return equipmentService.getFullById(id);
    }

    @GetMapping
    public List<EquipmentResponseDTO> getAll() {
        return equipmentService.getAll();
    }

    @GetMapping("/model/{modelId}")
    public List<EquipmentResponseDTO> getByModel(@PathVariable Integer modelId) {
        return equipmentService.getByModel(modelId);
    }

    @GetMapping("/find")
    public EquipmentResponseDTO getByModelAndSerial(@RequestParam Integer modelId, @RequestParam String serialNumber) {
        return equipmentService.getByModelAndSerial(modelId, serialNumber);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        equipmentService.delete(id);
    }
}