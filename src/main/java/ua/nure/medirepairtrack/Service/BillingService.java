package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.DTO.BillingDTO.*;
import ua.nure.medirepairtrack.DTO.ClaimDTO.ClaimResponseDTO;
import ua.nure.medirepairtrack.DTO.ClaimHistoryDTO.ClaimHistoryResponseDTO;
import ua.nure.medirepairtrack.DTO.ClientContractDTO.ContractDiscountDTO;
import ua.nure.medirepairtrack.DTO.DeliveryDTO.DeliveryResponseDTO;
import ua.nure.medirepairtrack.DTO.PartDTO.UsedPartResponseDTO;
import ua.nure.medirepairtrack.DTO.PricingDTO.PricingConfigResponseDTO;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Workflow.DeliveryStatusMachine;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {

    private static final BigDecimal HUNDRED = new BigDecimal("100");

    private final ClaimService claimService;
    private final ClaimHistoryService claimHistoryService;
    private final PartService partService;
    private final DeliveryService deliveryService;
    private final PricingConfigService pricingConfigService;
    private final ClientContractService clientContractService;

    private final DeliveryStatusMachine deliveryStatusMachine;

    public BillingSectionResultDTO calculateLabor(Integer claimId) {
        // =========================
        // LABOR (WORK LOG BASED)
        // =========================

        ClaimResponseDTO claim = claimService.getClaimById(claimId);
        PricingConfigResponseDTO pricing = pricingConfigService.getByRepairType(claim.getRepairType());
        ContractDiscountDTO discount = clientContractService.getActiveDiscounts(claim.getClientId());

        List<ClaimHistoryResponseDTO> workLogs = claimHistoryService.getWorkLogs(claimId);

        List<BillingItemDTO> items = new ArrayList<>();

        BigDecimal actualHours = BigDecimal.ZERO;

        for (ClaimHistoryResponseDTO log : workLogs) {

            actualHours = actualHours.add(log.getTimeSpent());

            items.add(
                    BillingItemDTO.builder()
                            .description("Роботи: " + log.getDescription())
                            .quantity(log.getTimeSpent())
                            .pricePerUnit(pricing.getLaborPricePerHour())
                            .totalPrice(
                                    log.getTimeSpent()
                                            .multiply(pricing.getLaborPricePerHour())
                            )
                            .unitName("год")
                            .build()
            );
        }

        BigDecimal billableHours = pricing.getLaborMinHours() == null
                ? actualHours
                : actualHours.max(pricing.getLaborMinHours());

        if (pricing.getLaborMinHours() != null
                && pricing.getLaborMinHours().compareTo(actualHours) > 0) {

            BigDecimal extra = pricing.getLaborMinHours().subtract(actualHours);

            items.add(
                    BillingItemDTO.builder()
                            .description("Мінімальна оплата за послугу")
                            .quantity(extra)
                            .pricePerUnit(pricing.getLaborPricePerHour())
                            .totalPrice(extra.multiply(pricing.getLaborPricePerHour()))
                            .unitName("год")
                            .build()
            );
        }

        BigDecimal beforeDiscount = billableHours.multiply(pricing.getLaborPricePerHour());

        BigDecimal afterDiscount = applyDiscount(beforeDiscount, discount.getDiscountLabor());

        return BillingSectionResultDTO.builder()
                .items(items)
                .totalBeforeDiscount(beforeDiscount)
                .discountAmount(beforeDiscount.subtract(afterDiscount))
                .totalAfterDiscount(afterDiscount)
                .build();
    }

    public BillingSectionResultDTO calculateParts(Integer claimId) {
        // =========================
        // PARTS
        // =========================

        ClaimResponseDTO claim = claimService.getClaimById(claimId);
        PricingConfigResponseDTO pricing = pricingConfigService.getByRepairType(claim.getRepairType());
        ContractDiscountDTO discount = clientContractService.getActiveDiscounts(claim.getClientId());

        List<UsedPartResponseDTO> usedParts = partService.getUsedPartsByClaim(claimId);

        List<BillingItemDTO> items = new ArrayList<>();

        BigDecimal beforeDiscount = BigDecimal.ZERO;

        for (UsedPartResponseDTO part : usedParts) {

            BigDecimal base = part.getQuantity().multiply(part.getUnitPrice());

            BigDecimal total = base.multiply(pricing.getPartsCoefficient());

            beforeDiscount = beforeDiscount.add(total);

            items.add(
                    BillingItemDTO.builder()
                            .description("Запчастина: " + part.getPartName())
                            .quantity(part.getQuantity())
                            .pricePerUnit(part.getUnitPrice())
                            .totalPrice(total)
                            .unitName(part.getUnitName())
                            .build()
            );
        }

        BigDecimal afterDiscount = applyDiscount(beforeDiscount, discount.getDiscountParts());

        return BillingSectionResultDTO.builder()
                .items(items)
                .totalBeforeDiscount(beforeDiscount)
                .discountAmount(beforeDiscount.subtract(afterDiscount))
                .totalAfterDiscount(afterDiscount)
                .build();
    }

    public BillingSectionResultDTO calculateDelivery(Integer claimId) {
        // =========================
        // Delivery
        // =========================

        ClaimResponseDTO claim = claimService.getClaimById(claimId);
        PricingConfigResponseDTO pricing = pricingConfigService.getByRepairType(claim.getRepairType());
        ContractDiscountDTO discount = clientContractService.getActiveDiscounts(claim.getClientId());

        List<DeliveryResponseDTO> deliveries =
                deliveryService.getByClaim(claimId).stream()
                        .filter(d -> deliveryStatusMachine.isBillable(d.getStatus()))
                        .toList();

        List<BillingItemDTO> items = new ArrayList<>();
        BigDecimal beforeDiscount = BigDecimal.ZERO;

        for (DeliveryResponseDTO d : deliveries) {

            BigDecimal base = resolveDeliveryBase(d);
            BigDecimal total = base.multiply(pricing.getDeliveryCoefficient());

            beforeDiscount = beforeDiscount.add(total);

            items.add(
                    BillingItemDTO.builder()
                            .description("Доставка: " + d.getType() + " (" + d.getProvider() + ")")
                            .quantity(d.getDistanceKm() != null ? d.getDistanceKm() : BigDecimal.ONE)
                            .pricePerUnit(
                                    d.getDistanceKm() != null ? d.getPricePerUnit() : base
                            )
                            .totalPrice(total)
                            .unitName(d.getDistanceKm() != null ? "км" : "послуга")
                            .build()
            );
        }

        BigDecimal afterDiscount = applyDiscount(beforeDiscount, discount.getDiscountDelivery());

        return BillingSectionResultDTO.builder()
                .items(items)
                .totalBeforeDiscount(beforeDiscount)
                .discountAmount(beforeDiscount.subtract(afterDiscount))
                .totalAfterDiscount(afterDiscount)
                .build();
    }

    public BillingResultDTO calculateFull(Integer claimId) {
        ClaimResponseDTO claim = claimService.getClaimById(claimId);

        BillingSectionResultDTO labor = calculateLabor(claimId);
        BillingSectionResultDTO parts = calculateParts(claimId);
        BillingSectionResultDTO delivery = calculateDelivery(claimId);

        // Гарантія - все 0
        if (claim.getRepairType() == RepairType.WARRANTY_REPAIR) {
            return BillingResultDTO.builder()
                    .laborItems(labor.getItems())
                    .partsItems(parts.getItems())
                    .deliveryItems(delivery.getItems())

                    .totalLabor(BigDecimal.ZERO)
                    .totalParts(BigDecimal.ZERO)
                    .totalDelivery(BigDecimal.ZERO)

                    .totalBeforeDiscount(BigDecimal.ZERO)
                    .discountAmount(BigDecimal.ZERO)
                    .grandTotal(BigDecimal.ZERO)
                    .build();
        }

        // звичайний сценарій
        BigDecimal totalBeforeDiscount =
                labor.getTotalBeforeDiscount()
                        .add(parts.getTotalBeforeDiscount())
                        .add(delivery.getTotalBeforeDiscount());

        BigDecimal grandTotal =
                labor.getTotalAfterDiscount()
                        .add(parts.getTotalAfterDiscount())
                        .add(delivery.getTotalAfterDiscount());

        return BillingResultDTO.builder()
                .laborItems(labor.getItems())
                .partsItems(parts.getItems())
                .deliveryItems(delivery.getItems())

                .totalLabor(labor.getTotalAfterDiscount())
                .totalParts(parts.getTotalAfterDiscount())
                .totalDelivery(delivery.getTotalAfterDiscount())

                .totalBeforeDiscount(totalBeforeDiscount)
                .discountAmount(totalBeforeDiscount.subtract(grandTotal))
                .grandTotal(grandTotal)
                .build();
    }

    // =========================
    // UTIL
    // =========================
    private BigDecimal applyDiscount(BigDecimal value, BigDecimal discountPercent) {

        if (discountPercent == null || discountPercent.compareTo(BigDecimal.ZERO) == 0) {
            return value.setScale(2, RoundingMode.HALF_UP);
        }

        return value.multiply(
                        BigDecimal.ONE.subtract(
                                discountPercent.divide(HUNDRED, 4, RoundingMode.HALF_UP)
                        )
                )
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal resolveDeliveryBase(DeliveryResponseDTO d) {

        // POSTAL / fixed price
        if (d.getPrice() != null) {
            return d.getPrice();
        }

        // ENGINEER trip
        if (d.getDistanceKm() != null && d.getPricePerUnit() != null) {
            return d.getDistanceKm().multiply(d.getPricePerUnit());
        }

        throw new OperationNotAllowedException(
                "Некоректні дані доставки: необхідно price або distanceKm + pricePerUnit. deliveryId=" + d.getId()
        );
    }
}
