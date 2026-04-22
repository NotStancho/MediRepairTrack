package ua.nure.medirepairtrack.Repository.delivery;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.Delivery;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {

    @Query("""
            SELECT d FROM Delivery d
            JOIN FETCH d.claim c
            JOIN FETCH c.client
            ORDER BY d.createdAt DESC
            """)
    List<Delivery> findAllWithClaimAndClient();

    @Query("""
    SELECT d FROM Delivery d
    JOIN FETCH d.claim c
    JOIN FETCH c.client
    WHERE c.client.id = :clientId
    ORDER BY d.createdAt DESC
""")
    List<Delivery> findAllByClientIdWithFetch(@Param("clientId") Integer clientId);

    List<Delivery> findByClaimId(Integer claimId);
}
