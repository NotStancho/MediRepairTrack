package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.PricingDTO.*;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;
import ua.nure.medirepairtrack.Service.PricingConfigService;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingConfigController {

    private final PricingConfigService service;

//    @PostMapping
//    public PricingConfigResponseDTO create(@Valid @RequestBody CreatePricingConfigDTO dto) {
//        return service.create(dto);
//    }

    @PutMapping("/{repairType}")
    public PricingConfigResponseDTO update(@PathVariable RepairType repairType, @Valid @RequestBody UpdatePricingConfigDTO dto) {
        return service.update(repairType, dto);
    }

    @GetMapping("/{repairType}")
    public PricingConfigResponseDTO getByRepairType(@PathVariable RepairType repairType) {
        return service.getByRepairType(repairType);
    }

    @GetMapping
    public List<PricingConfigResponseDTO> getAll() {
        return service.getAll();
    }

//    @DeleteMapping("/{repairType}")
//    public void delete(@PathVariable RepairType repairType) {
//        service.delete(repairType);
//    }
}
