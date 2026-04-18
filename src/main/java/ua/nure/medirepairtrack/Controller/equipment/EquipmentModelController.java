package ua.nure.medirepairtrack.Controller.equipment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.CreateEquipmentModelDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.EquipmentModelResponseDTO;
import ua.nure.medirepairtrack.DTO.equipment.EquipmentModelDTO.UpdateEquipmentModelDTO;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentType;
import ua.nure.medirepairtrack.Service.equipment.EquipmentModelService;

import java.util.List;

@RestController
@RequestMapping("/api/equipment-model")
@RequiredArgsConstructor
public class EquipmentModelController {

    private final EquipmentModelService equipmentModelService;

    @PostMapping
    public EquipmentModelResponseDTO create(@Valid @RequestBody CreateEquipmentModelDTO dto) {
        return equipmentModelService.create(dto);
    }

    @PutMapping("/{id}")
    public EquipmentModelResponseDTO update(@PathVariable Integer id,
                                            @Valid @RequestBody UpdateEquipmentModelDTO dto) {
        return equipmentModelService.update(id, dto);
    }

    @GetMapping("/{id}")
    public EquipmentModelResponseDTO getById(@PathVariable Integer id) {
        return equipmentModelService.getById(id);
    }

    @GetMapping
    public List<EquipmentModelResponseDTO> getAll() {
        return equipmentModelService.getAll();
    }

    @GetMapping("/search/model-name")
    public List<EquipmentModelResponseDTO> searchByModelName(@RequestParam String q) {
        return equipmentModelService.searchByModelName(q);
    }

    @GetMapping("/search/manufacturer")
    public List<EquipmentModelResponseDTO> searchByManufacturer(@RequestParam String q) {
        return equipmentModelService.searchByManufacturer(q);
    }

    @GetMapping("/type/{type}")
    public List<EquipmentModelResponseDTO> findByType(@PathVariable EquipmentType type) {
        return equipmentModelService.findByType(type);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        equipmentModelService.delete(id);
    }
}
