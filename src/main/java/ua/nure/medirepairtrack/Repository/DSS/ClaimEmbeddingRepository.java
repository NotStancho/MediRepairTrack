package ua.nure.medirepairtrack.Repository.DSS;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.nure.medirepairtrack.Entity.DSS.ClaimEmbedding.ClaimEmbedding;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentType;

import java.util.List;

public interface ClaimEmbeddingRepository extends JpaRepository<ClaimEmbedding, Integer> {

    @Query("""
        select ce
        from ClaimEmbedding ce
        join ce.claim c
        join c.equipment e
        join e.model m
        where ce.claimId <> :claimId
          and m.id = :modelId
          and ce.modelName = :modelName
          and ce.dimension = :dimension
    """)
    List<ClaimEmbedding> findCandidatesBySameModel(Integer claimId, Integer modelId, String modelName, int dimension);

    @Query("""
        select ce
        from ClaimEmbedding ce
        join ce.claim c
        join c.equipment e
        join e.model m
        where ce.claimId <> :claimId
          and m.manufacturer = :manufacturer
          and m.type = :type
          and ce.modelName = :modelName
          and ce.dimension = :dimension
    """)
    List<ClaimEmbedding> findCandidatesBySameManufacturerAndEquipmentType(Integer claimId, String manufacturer, EquipmentType type, String modelName, int dimension);

    @Query("""
        select ce
        from ClaimEmbedding ce
        join ce.claim c
        join c.equipment e
        join e.model m
        where ce.claimId <> :claimId
          and m.type = :type
          and ce.modelName = :modelName
          and ce.dimension = :dimension
    """)
    List<ClaimEmbedding> findCandidatesBySameEquipmentType(Integer claimId, EquipmentType type, String modelName, int dimension);

    @Query("""
        select ce
        from ClaimEmbedding ce
        join ce.claim c
        join c.equipment e
        join e.model m
        where ce.claimId <> :claimId
          and m.manufacturer = :manufacturer
          and ce.modelName = :modelName
          and ce.dimension = :dimension
    """)
    List<ClaimEmbedding> findCandidatesBySameManufacturer(Integer claimId, String manufacturer, String modelName, int dimension);

    @Query("""
        select ce
        from ClaimEmbedding ce
        where ce.claimId <> :claimId
          and ce.modelName = :modelName
          and ce.dimension = :dimension
    """)
    List<ClaimEmbedding> findCandidatesAll(Integer claimId, String modelName, int dimension);
}