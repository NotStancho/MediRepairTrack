package ua.nure.medirepairtrack.Repository.repair;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.repair.RepairOperation.RepairOperation;

public interface RepairOperationRepository extends JpaRepository<RepairOperation, Integer> {
    boolean existsByName(String name);
}
