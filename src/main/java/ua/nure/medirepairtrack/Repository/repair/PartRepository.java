package ua.nure.medirepairtrack.Repository.repair;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;

import java.util.Optional;

public interface PartRepository extends JpaRepository<Part, Integer> {
    Optional<Part> findByPartCode(String partCode);
    boolean existsByPartCode(String partCode);
}
