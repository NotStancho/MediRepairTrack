package ua.nure.medirepairtrack.Controller.client;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.client.ClientContractDTO.ClientContractResponseDTO;
import ua.nure.medirepairtrack.DTO.client.ClientContractDTO.ContractDiscountDTO;
import ua.nure.medirepairtrack.DTO.client.ClientContractDTO.CreateClientContractDTO;
import ua.nure.medirepairtrack.DTO.client.ClientContractDTO.UpdateClientContractFullDTO;
import ua.nure.medirepairtrack.Service.client.ClientContractService;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ClientContractController {

    private final ClientContractService clientContractService;

    // --- Створення контракту (менеджер / адмін) ---
    @PostMapping
    public ClientContractResponseDTO create(@Valid @RequestBody CreateClientContractDTO dto) {
        return clientContractService.create(dto);
    }

    // --- Усі контракти клієнта ---
    @GetMapping("/client/{clientId}")
    public List<ClientContractResponseDTO> getByClient(@PathVariable Integer clientId) {
        return clientContractService.getByClient(clientId);
    }

    // --- Деактивація контракту ---
    @PutMapping("/{id}/deactivate")
    public ClientContractResponseDTO deactivate(@PathVariable Integer id) {
        return clientContractService.deactivate(id);
    }

    @PutMapping("/{id}")
    public ClientContractResponseDTO updateFull(@PathVariable Integer id, @Valid @RequestBody UpdateClientContractFullDTO dto) {
        return clientContractService.updateFull(id, dto);
    }


    // --- API ДЛЯ BillingService ---
    // (може бути internal, але для курсової ок)
    @GetMapping("/client/{clientId}/discounts")
    public ContractDiscountDTO getActiveDiscounts(@PathVariable Integer clientId) {
        return clientContractService.getActiveDiscounts(clientId);
    }
}

