package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.DefectCategory.DefectCategory;

public interface DefectCategoryRepository extends JpaRepository<DefectCategory, Integer> {
}
