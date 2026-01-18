package ua.nure.medirepairtrack.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.Client.Client;
import java.util.Optional;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    List<Client> findByOrganizationNameContainingIgnoreCase(String name);
    List<Client> findByOrganizationEmailContainingIgnoreCase(String email);
    Optional<Client> findByUserId(Integer userId);

    @Query("""
    SELECT c FROM Client c
    WHERE
        LOWER(c.organizationName) LIKE LOWER(CONCAT(:q, '%'))
        OR LOWER(c.organizationEmail) LIKE LOWER(CONCAT(:q, '%'))
        OR LOWER(c.contactPersonName) LIKE LOWER(CONCAT(:q, '%'))
        OR c.organizationPhoneNumber LIKE CONCAT(:q, '%')
    ORDER BY c.organizationName
""")
    List<Client> searchPrefix(@Param("q") String q, Pageable pageable);
}
