package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.Client.Client;
import java.util.Optional;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    List<Client> findByOrganizationNameContainingIgnoreCase(String name);
    List<Client> findByOrganizationEmailContainingIgnoreCase(String email);
    Optional<Client> findByUserId(Integer userId);
}
