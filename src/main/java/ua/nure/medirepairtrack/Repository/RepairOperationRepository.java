package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.RepairOperation.RepairOperation;

public interface RepairOperationRepository extends JpaRepository<RepairOperation, Integer> {
    boolean existsByName(String name);
}
