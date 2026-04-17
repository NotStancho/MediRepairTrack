package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DSS.ComplexityLevel;

public interface ComplexityLevelRepository extends JpaRepository<ComplexityLevel, Integer> {
}
