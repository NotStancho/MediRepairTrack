package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.ClientDTO.*;
import ua.nure.medirepairtrack.Entity.Client.Client;
import ua.nure.medirepairtrack.Entity.User.Role;
import ua.nure.medirepairtrack.Entity.User.User;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.ClientRepository;
import ua.nure.medirepairtrack.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    // --- Сценарій 1: клієнт реєструється сам ---
    @Transactional
    public ClientResponseDTO registerClientWithUser(RegisterClientWithUserDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email вже використовується");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(Role.CLIENT)
                .firstName(dto.getFirstName())
                .middleName(dto.getMiddleName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        Client client = Client.builder()
                .user(user)
                .organizationName(dto.getOrganizationName())
                .organizationEmail(dto.getOrganizationEmail())
                .organizationPhoneNumber(dto.getOrganizationPhoneNumber())
                .address(dto.getAddress())
                .contactPersonName(dto.getContactPersonName())
                .notes(dto.getNotes())
                .build();

        clientRepository.save(client);

        return mapToResponse(client);
    }

    // --- Сценарій 2: менеджер створює клієнта без user ---
    public ClientResponseDTO createClient(CreateClientDTO dto) {
        Client client = Client.builder()
                .organizationName(dto.getOrganizationName())
                .organizationEmail(dto.getOrganizationEmail())
                .organizationPhoneNumber(dto.getOrganizationPhoneNumber())
                .address(dto.getAddress())
                .contactPersonName(dto.getContactPersonName())
                .notes(dto.getNotes())
                .build();

        clientRepository.save(client);

        return mapToResponse(client);
    }

    public ClientResponseDTO update(Integer id, UpdateClientDTO dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Клієнт не знайдений"));

        if (dto.getOrganizationName() != null)
            client.setOrganizationName(dto.getOrganizationName());

        if (dto.getOrganizationEmail() != null)
            client.setOrganizationEmail(dto.getOrganizationEmail());

        if (dto.getOrganizationPhoneNumber() != null)
            client.setOrganizationPhoneNumber(dto.getOrganizationPhoneNumber());

        if (dto.getContactPersonName() != null)
            client.setContactPersonName(dto.getContactPersonName());

        if (dto.getAddress() != null)
            client.setAddress(dto.getAddress());

        if (dto.getNotes() != null)
            client.setNotes(dto.getNotes());

        clientRepository.save(client);

        return mapToResponse(client);
    }

    public ClientResponseDTO getById(Integer id) {
        return clientRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new NotFoundException("Клієнт не знайдений"));
    }

    public List<ClientResponseDTO> getAll() {
        return clientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ClientFullResponseDTO getByUserId(Integer userId) {
        Client client = clientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Клієнта для цього користувача не знайдено"));

        return mapToFullResponse(client);
    }

    public ClientFullResponseDTO getFullById(Integer id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Клієнт не знайдений"));

        return mapToFullResponse(client);
    }

    public List<ClientSearchDTO> searchClients(String q, int limit) {
        if (q == null || q.length() < 2) {
            return List.of();
        }

        int safeLimit = Math.min(Math.max(limit, 1), 20);

        return clientRepository
                .searchPrefix(q, PageRequest.of(0, safeLimit))
                .stream()
                .map(this::mapToSearchDto)
                .toList();
    }

    public List<ClientResponseDTO> searchByOrganization(String name) {
        return clientRepository.findByOrganizationNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ClientResponseDTO> searchByEmail(String email) {
        return clientRepository.findByOrganizationEmailContainingIgnoreCase(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void delete(Integer id) {
        if (!clientRepository.existsById(id)) {
            throw new NotFoundException("Клієнт не знайдений");
        }
        clientRepository.deleteById(id);
    }

    private ClientResponseDTO mapToResponse(Client c) {
        return ClientResponseDTO.builder()
                .id(c.getId())
                .userId(c.getUser() != null ? c.getUser().getId() : null)
                .organizationName(c.getOrganizationName())
                .organizationEmail(c.getOrganizationEmail())
                .organizationPhoneNumber(c.getOrganizationPhoneNumber())
                .contactPersonName(c.getContactPersonName())
                .address(c.getAddress())
                .notes(c.getNotes())
                .build();
    }

    private ClientSearchDTO mapToSearchDto(Client c) {
        return ClientSearchDTO.builder()
                .id(c.getId())
                .organizationName(c.getOrganizationName())
                .organizationEmail(c.getOrganizationEmail())
                .organizationPhoneNumber(c.getOrganizationPhoneNumber())
                .contactPersonName(c.getContactPersonName())
                .build();
    }

    private ClientFullResponseDTO mapToFullResponse(Client c) {
        return ClientFullResponseDTO.builder()
                .id(c.getId())

                .userId(c.getUser() != null ? c.getUser().getId() : null)
                .userEmail(c.getUser() != null ? c.getUser().getEmail() : null)
                .userFirstName(c.getUser() != null ? c.getUser().getFirstName() : null)
                .userMiddleName(c.getUser() != null ? c.getUser().getMiddleName() : null)
                .userLastName(c.getUser() != null ? c.getUser().getLastName() : null)
                .userPhone(c.getUser() != null ? c.getUser().getPhone() : null)

                .organizationName(c.getOrganizationName())
                .organizationEmail(c.getOrganizationEmail())
                .organizationPhoneNumber(c.getOrganizationPhoneNumber())
                .contactPersonName(c.getContactPersonName())
                .address(c.getAddress())
                .notes(c.getNotes())
                .build();
    }
}
