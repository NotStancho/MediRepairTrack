package ua.nure.medirepairtrack.Service.billing;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO.CreatePricingConfigDTO;
import ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO.PricingConfigResponseDTO;
import ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO.UpdatePricingConfigDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.billing.PricingConfig.PricingConfig;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.billing.PricingConfigRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PricingConfigService {

    private final PricingConfigRepository repository;

    @Transactional
    public PricingConfigResponseDTO create(CreatePricingConfigDTO dto) {

        if (repository.existsById(dto.getRepairType())) {
            throw new BadRequestException("Тариф для цього типу ремонту вже існує");
        }

        PricingConfig config = PricingConfig.builder()
                .repairType(dto.getRepairType())
                .laborPricePerHour(dto.getLaborPricePerHour())
                .laborMinHours(dto.getLaborMinHours())
                .partsCoefficient(dto.getPartsCoefficient())
                .deliveryCoefficient(dto.getDeliveryCoefficient())
                .description(dto.getDescription())
                .createdAt(LocalDateTime.now())
                .build();

        return map(repository.save(config));
    }

    @Transactional
    public PricingConfigResponseDTO update(RepairType repairType, UpdatePricingConfigDTO dto) {

        PricingConfig config = repository.findById(repairType)
                .orElseThrow(() -> new NotFoundException("Тариф не знайдений"));

        if (dto.getLaborPricePerHour() != null)
            config.setLaborPricePerHour(dto.getLaborPricePerHour());

        if (dto.getLaborMinHours() != null)
            config.setLaborMinHours(dto.getLaborMinHours());

        if (dto.getPartsCoefficient() != null)
            config.setPartsCoefficient(dto.getPartsCoefficient());

        if (dto.getDeliveryCoefficient() != null)
            config.setDeliveryCoefficient(dto.getDeliveryCoefficient());

        if (dto.getDescription() != null)
            config.setDescription(dto.getDescription());

        config.setUpdatedAt(LocalDateTime.now());

        return map(repository.save(config));
    }

    public PricingConfigResponseDTO getByRepairType(RepairType repairType) {
        return repository.findById(repairType)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Тариф не знайдений"));
    }

    public List<PricingConfigResponseDTO> getAll() {
        return repository.findAll().stream().map(this::map).toList();
    }

    @Transactional
    public void delete(RepairType repairType) {
        if (!repository.existsById(repairType)) {
            throw new NotFoundException("Тариф не знайдений");
        }
        repository.deleteById(repairType);
    }

    private PricingConfigResponseDTO map(PricingConfig c) {
        return PricingConfigResponseDTO.builder()
                .repairType(c.getRepairType())
                .laborPricePerHour(c.getLaborPricePerHour())
                .laborMinHours(c.getLaborMinHours())
                .partsCoefficient(c.getPartsCoefficient())
                .deliveryCoefficient(c.getDeliveryCoefficient())
                .description(c.getDescription())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}