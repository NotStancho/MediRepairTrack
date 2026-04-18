package ua.nure.medirepairtrack.Repository.diagnosis;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.diagnosis.DefectCategory.DefectCategory;

public interface DefectCategoryRepository extends JpaRepository<DefectCategory, Integer> {
}
