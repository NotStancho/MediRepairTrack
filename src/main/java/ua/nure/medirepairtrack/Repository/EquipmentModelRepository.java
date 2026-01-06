package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.EquipmentModel.EquipmentModel;
import ua.nure.medirepairtrack.Entity.EquipmentModel.EquipmentType;

import java.util.List;

public interface EquipmentModelRepository extends JpaRepository<EquipmentModel, Integer> {

    List<EquipmentModel> findByManufacturerContainingIgnoreCase(String manufacturer);

    List<EquipmentModel> findByType(EquipmentType type);

    List<EquipmentModel> findByModelNameContainingIgnoreCase(String modelName);
}