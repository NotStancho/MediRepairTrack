package ua.nure.medirepairtrack.Repository.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.billing.PricingConfig.PricingConfig;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;

public interface PricingConfigRepository extends JpaRepository<PricingConfig, RepairType> {
}
