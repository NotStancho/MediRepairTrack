package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.Pricing.PricingConfig;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;

public interface PricingConfigRepository extends JpaRepository<PricingConfig, RepairType> {
}
