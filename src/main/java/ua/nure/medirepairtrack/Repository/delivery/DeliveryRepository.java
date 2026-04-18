package ua.nure.medirepairtrack.Repository.delivery;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.Delivery;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {

    List<Delivery> findByClaimId(Integer claimId);
}
