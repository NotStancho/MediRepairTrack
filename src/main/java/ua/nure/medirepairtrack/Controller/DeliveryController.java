package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DeliveryDTO.*;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryStatus;
import ua.nure.medirepairtrack.Service.DeliveryService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/engineer")
    public DeliveryResponseDTO createEngineerTrip(@RequestParam Integer employeeId, @Valid @RequestBody CreateEngineerDeliveryDTO dto) {
        return deliveryService.createEngineerTrip(employeeId, dto);
    }

    @PostMapping("/postal")
    public DeliveryResponseDTO createPostalDelivery(@RequestParam Integer employeeId, @Valid @RequestBody CreatePostalDeliveryDTO dto) {
        return deliveryService.createPostalDelivery(employeeId, dto);
    }



    @PutMapping("/engineer/{id}")
    public DeliveryResponseDTO updateEngineer(@PathVariable Integer id, @RequestParam Integer employeeId, @Valid @RequestBody UpdateEngineerDeliveryDTO dto) {
        return deliveryService.updateEngineerDelivery(id, employeeId, dto);
    }

    @PutMapping("/postal/{id}")
    public DeliveryResponseDTO updatePostal(@PathVariable Integer id, @RequestParam Integer employeeId, @Valid @RequestBody UpdatePostalDeliveryDTO dto) {
        return deliveryService.updatePostalDelivery(id, employeeId, dto);
    }



    @GetMapping("/{id}/allowed-statuses")
    public Set<DeliveryStatus> getAllowedStatuses(@PathVariable Integer id) {
        return deliveryService.getAllowedNextStatuses(id);
    }

    @PatchMapping("/{id}/status")
    public DeliveryResponseDTO changeStatus(@PathVariable Integer id, @RequestParam Integer employeeId, @Valid @RequestBody UpdateDeliveryStatusDTO dto) {
        return deliveryService.changeDeliveryStatus(id, employeeId, dto);
    }



    @GetMapping("/{id}")
    public DeliveryResponseDTO getById(@PathVariable Integer id) {
        return deliveryService.getById(id);
    }

    @GetMapping("/claim/{claimId}")
    public List<DeliveryResponseDTO> getByClaim(@PathVariable Integer claimId) {
        return deliveryService.getByClaim(claimId);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam Integer employeeId) {
        deliveryService.delete(id, employeeId);
    }
}
