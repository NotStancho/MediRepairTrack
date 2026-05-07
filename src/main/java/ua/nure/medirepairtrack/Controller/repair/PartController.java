package ua.nure.medirepairtrack.Controller.repair;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.AddStockDTO;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.CreatePartDTO;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.PartResponseDTO;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.UpdatePartDTO;
import ua.nure.medirepairtrack.Service.repair.PartService;

import java.util.List;

@RestController
@RequestMapping("/api/part")
@RequiredArgsConstructor
public class PartController {

    private final PartService partService;

    @PostMapping
    public PartResponseDTO create(@Valid @RequestBody CreatePartDTO dto) {
        return partService.create(dto);
    }

    @PutMapping("/{partId}")
    public PartResponseDTO update(@PathVariable Integer partId, @Valid @RequestBody UpdatePartDTO dto) {
        return partService.update(partId, dto);
    }

    @GetMapping("/{partId}")
    public PartResponseDTO getById(@PathVariable Integer partId) {
        return partService.getById(partId);
    }

    @GetMapping
    public List<PartResponseDTO> getAll() {
        return partService.getAll();
    }

    @DeleteMapping("/{partId}")
    public void delete(@PathVariable Integer partId) {
        partService.delete(partId);
    }

    // stock
    @PatchMapping("/{partId}/add-stock")
    public PartResponseDTO addStock(@PathVariable Integer partId, @Valid @RequestBody AddStockDTO dto) {
        return partService.addStock(partId, dto);
    }
}
