package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.PartDTO.*;
import ua.nure.medirepairtrack.Service.PartService;

import java.util.List;

@RestController
@RequestMapping("/api/part")
@RequiredArgsConstructor
public class PartController {

    private final PartService partService;

    // CRUD
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

    // use in claim
    @PostMapping("/claim/{claimId}/use")
    public UsedPartResponseDTO usePart(@PathVariable Integer claimId, @RequestParam Integer employeeId, @Valid @RequestBody UsePartDTO dto) {
        return partService.usePart(claimId, employeeId, dto);
    }

    @PatchMapping("/claim/{claimId}/used")
    public UsedPartResponseDTO updateUsedPartQuantity(@PathVariable Integer claimId, @RequestParam Integer employeeId, @Valid @RequestBody UpdateUsedPartQuantityDTO dto) {
        return partService.updateUsedPartQuantity(claimId, employeeId, dto);
    }

    @GetMapping("/claim/{claimId}/used")
    public List<UsedPartResponseDTO> getUsedByClaim(@PathVariable Integer claimId) {
        return partService.getUsedPartsByClaim(claimId);
    }
}
