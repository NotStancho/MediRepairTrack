package ua.nure.medirepairtrack.Repository.repair;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.repair.RepairWork.RepairWork;

public interface RepairWorkRepository extends JpaRepository<RepairWork, Integer> {
    boolean existsByName(String name);
}
