package ua.nure.medirepairtrack.Repository.equipment;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.equipment.Equipment.Equipment;

import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Integer> {

    List<Equipment> findByModelId(Integer modelId);

    Optional<Equipment> findByModelIdAndSerialNumber(Integer modelId, String serialNumber);

    boolean existsByModelIdAndSerialNumber(Integer modelId, String serialNumber);
}
