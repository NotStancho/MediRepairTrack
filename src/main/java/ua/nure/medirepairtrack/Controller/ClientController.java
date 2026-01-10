package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.ClientDTO.*;
import ua.nure.medirepairtrack.Service.ClientService;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    // Сценарій 1: клієнт сам реєструється
    @PostMapping("/register")
    public ClientResponseDTO register(@Valid @RequestBody RegisterClientWithUserDTO dto) {
        return clientService.registerClientWithUser(dto);
    }

    // Сценарій 2: менеджер створює клієнта без user
    @PostMapping
    public ClientResponseDTO create(@Valid @RequestBody CreateClientDTO dto) {
        return clientService.createClient(dto);
    }

    @PutMapping("/{id}")
    public ClientResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateClientDTO dto) {
        return clientService.update(id, dto);
    }

    @GetMapping("/{id}")
    public ClientResponseDTO getById(@PathVariable Integer id) {
        return clientService.getById(id);
    }

    @GetMapping
    public List<ClientResponseDTO> getAll() {
        return clientService.getAll();
    }

    @GetMapping("/me")
    public ClientFullResponseDTO getMyClientProfile(@RequestParam Integer userId) {
        return clientService.getByUserId(userId);
    }

    @GetMapping("/{id}/full")
    public ClientFullResponseDTO getFullById(@PathVariable Integer id) {
        return clientService.getFullById(id);
    }

    @GetMapping("/search/organization")
    public List<ClientResponseDTO> searchByOrganization(@RequestParam String name) {
        return clientService.searchByOrganization(name);
    }

    @GetMapping("/search/email")
    public List<ClientResponseDTO> searchByEmail(@RequestParam String email) {
        return clientService.searchByEmail(email);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        clientService.delete(id);
    }
}
