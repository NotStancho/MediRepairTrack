package ua.nure.medirepairtrack.Controller.delivery;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO.*;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryStatus;
import ua.nure.medirepairtrack.Service.delivery.DeliveryService;

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
    public DeliveryViewDTO getById(@PathVariable Integer id) {
        return deliveryService.getById(id);
    }

    @GetMapping
    public List<DeliveryViewDTO> getAll() {
        return deliveryService.getAll();
    }

    @GetMapping("/client/{clientId}")
    public List<DeliveryViewDTO> getByClient(@PathVariable Integer clientId) {
        return deliveryService.getByClient(clientId);
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
