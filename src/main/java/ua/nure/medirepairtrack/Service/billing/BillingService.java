package ua.nure.medirepairtrack.Service.billing;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.DTO.billing.BillingDTO.BillingItemDTO;
import ua.nure.medirepairtrack.DTO.billing.BillingDTO.BillingResultDTO;
import ua.nure.medirepairtrack.DTO.billing.BillingDTO.BillingSectionResultDTO;
import ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO.PricingConfigResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimDTO.ClaimResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO.ClaimWorkPartResponseDTO;
import ua.nure.medirepairtrack.DTO.client.ClientContractDTO.ContractDiscountDTO;
import ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO.DeliveryResponseDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.claim.ClaimWork.ClaimWork;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Service.claim.ClaimService;
import ua.nure.medirepairtrack.Service.claim.ClaimWorkPartService;
import ua.nure.medirepairtrack.Service.claim.ClaimWorkService;
import ua.nure.medirepairtrack.Service.client.ClientContractService;
import ua.nure.medirepairtrack.Service.delivery.DeliveryService;
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
    private final ClaimWorkService claimWorkService;
    private final ClaimWorkPartService claimWorkPartService;
    private final DeliveryService deliveryService;
    private final PricingConfigService pricingConfigService;
    private final ClientContractService clientContractService;

    private final DeliveryStatusMachine deliveryStatusMachine;

    public BillingSectionResultDTO calculateLabor(Integer claimId) {
        // =========================
        // LABOR (CLAIM WORK BASED)
        // =========================

        ClaimResponseDTO claim = claimService.getClaimById(claimId);
        PricingConfigResponseDTO pricing = pricingConfigService.getByRepairType(claim.getRepairType());
        ContractDiscountDTO discount = clientContractService.getActiveDiscounts(claim.getClientId());

        List<ClaimWork> works = claimWorkService.getClaimWorks(claimId);

        List<BillingItemDTO> items = new ArrayList<>();

        BigDecimal actualHours = BigDecimal.ZERO;

        for (ClaimWork work : works) {

            actualHours = actualHours.add(work.getTimeSpent());

            items.add(
                    BillingItemDTO.builder()
                            .description(buildLaborDescription(work))
                            .quantity(work.getTimeSpent())
                            .pricePerUnit(pricing.getLaborPricePerHour())
                            .totalPrice(
                                    work.getTimeSpent()
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

        List<ClaimWorkPartResponseDTO> claimWorkParts = claimWorkPartService.getPartsByClaim(claimId);

        List<BillingItemDTO> items = new ArrayList<>();

        BigDecimal beforeDiscount = BigDecimal.ZERO;

        for (ClaimWorkPartResponseDTO part : claimWorkParts) {

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

        throw new BadRequestException(
                "Некоректні дані доставки: необхідно price або distanceKm + pricePerUnit. deliveryId=" + d.getId()
        );
    }

    private String buildLaborDescription(ClaimWork work) {
        String base = "Робота: " + work.getRepairWork().getName();

        if (work.getNote() == null || work.getNote().isBlank()) {
            return base;
        }

        return base + ". Примітка: " + work.getNote();
    }
}
