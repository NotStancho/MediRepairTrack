package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.DTO.ClientContractDTO.*;
import ua.nure.medirepairtrack.Entity.Client.Client;
import ua.nure.medirepairtrack.Entity.ClientContract.ClientContract;
import ua.nure.medirepairtrack.Entity.ClientContract.ContractStatus;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.ClientContractRepository;
import ua.nure.medirepairtrack.Repository.ClientRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientContractService {

    private final ClientContractRepository contractRepository;
    private final ClientRepository clientRepository;

    // --- Створення контракту ---
    public ClientContractResponseDTO create(CreateClientContractDTO dto) {

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new NotFoundException("Клієнт не знайдений"));

        ClientContract contract = ClientContract.builder()
                .client(client)
                .contractName(dto.getContractName())
                .contractType(dto.getContractType())
                .isActive(ContractStatus.ACTIVE)
                .validFrom(dto.getValidFrom())
                .validTo(dto.getValidTo())
                .discountLabor(dto.getDiscountLabor())
                .discountParts(dto.getDiscountParts())
                .discountDelivery(dto.getDiscountDelivery())
                .notes(dto.getNotes())
                .createdAt(LocalDateTime.now())
                .build();

        contractRepository.save(contract);
        return map(contract);
    }

    // --- Отримати всі контракти клієнта ---
    public List<ClientContractResponseDTO> getByClient(Integer clientId) {
        return contractRepository.findByClientId(clientId)
                .stream()
                .map(this::map)
                .toList();
    }

    // --- Деактивація контракту ---
    public ClientContractResponseDTO deactivate(Integer id) {
        ClientContract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Контракт не знайдений"));

        contract.setIsActive(ContractStatus.INACTIVE);
        contract.setUpdatedAt(LocalDateTime.now());
        contractRepository.save(contract);

        return map(contract);
    }

    public ClientContractResponseDTO updateFull(Integer id, UpdateClientContractFullDTO dto) {
        ClientContract c = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Контракт не знайдений"));

        c.setContractName(dto.getContractName());
        c.setContractType(dto.getContractType());
        c.setIsActive(dto.getIsActive());
        c.setValidFrom(dto.getValidFrom());
        c.setValidTo(dto.getValidTo());
        c.setDiscountLabor(dto.getDiscountLabor());
        c.setDiscountParts(dto.getDiscountParts());
        c.setDiscountDelivery(dto.getDiscountDelivery());
        c.setNotes(dto.getNotes());

        return map(contractRepository.save(c));
    }

    // --- 🔥 API ДЛЯ BillingService ---
    public ContractDiscountDTO getActiveDiscounts(Integer clientId) {

        LocalDate today = LocalDate.now();

        ClientContract contract = contractRepository
                .findFirstByClientIdAndIsActiveAndValidFromLessThanEqualAndValidToGreaterThanEqual(
                        clientId, ContractStatus.ACTIVE, today, today
                )
                .orElse(null);

        if (contract == null) {
            return ContractDiscountDTO.builder()
                    .discountLabor(BigDecimal.ZERO)
                    .discountParts(BigDecimal.ZERO)
                    .discountDelivery(BigDecimal.ZERO)
                    .build();
        }

        return ContractDiscountDTO.builder()
                .discountLabor(contract.getDiscountLabor())
                .discountParts(contract.getDiscountParts())
                .discountDelivery(contract.getDiscountDelivery())
                .build();
    }

    private ClientContractResponseDTO map(ClientContract c) {
        return ClientContractResponseDTO.builder()
                .id(c.getId())
                .clientId(c.getClient().getId())
                .contractName(c.getContractName())
                .contractType(c.getContractType())
                .status(c.getIsActive())
                .validFrom(c.getValidFrom())
                .validTo(c.getValidTo())
                .discountLabor(c.getDiscountLabor())
                .discountParts(c.getDiscountParts())
                .discountDelivery(c.getDiscountDelivery())
                .build();
    }
}

