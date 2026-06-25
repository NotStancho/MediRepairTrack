package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.Entity.DSS.ClaimEmbedding.ClaimEmbedding;
import ua.nure.medirepairtrack.Entity.DSS.Similarity.SimilaritySearchMode;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.equipment.EquipmentModel.EquipmentModel;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.ClaimEmbeddingRepository;
import ua.nure.medirepairtrack.util.EmbeddingConverter;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SimilaritySearchService {

    private final ClaimEmbeddingRepository claimEmbeddingRepository;

    @Value("${dss.similarity.top-k}")
    private int topK;

    @Value("${dss.similarity.threshold}")
    private double threshold;

    @Value("${dss.similarity.min-candidates}")
    private int minCandidates;

    public SimilaritySearchResult findSimilarClaims(Claim claim, SimilaritySearchMode mode) {
        SimilaritySearchMode requestedMode = mode != null
                ? mode
                : SimilaritySearchMode.AUTO_HIERARCHICAL;

        ClaimEmbedding sourceEmbedding = getSourceEmbedding(claim);

        SearchCandidates candidates = resolveCandidates(claim, sourceEmbedding, requestedMode);

        float[] sourceVector = EmbeddingConverter.fromByteArray(sourceEmbedding.getEmbeddingVector());

        List<SimilarClaim> similarClaims = candidates.embeddings()
                .stream()
                .map(candidate -> {
                    float[] targetVector = EmbeddingConverter.fromByteArray(candidate.getEmbeddingVector());
                    double score = cosineSimilarity(sourceVector, targetVector);

                    return new SimilarClaim(candidate.getClaimId(), score);
                })
                .filter(result -> result.score() >= threshold)
                .sorted(Comparator.comparing(SimilarClaim::score).reversed())
                .limit(topK)
                .toList();

        return new SimilaritySearchResult(requestedMode, candidates.resolvedMode(), similarClaims);
    }

    private SearchCandidates resolveCandidates(Claim claim, ClaimEmbedding sourceEmbedding, SimilaritySearchMode mode) {
        return switch (mode) {
            case SAME_MODEL -> new SearchCandidates(
                    SimilaritySearchMode.SAME_MODEL, findSameModel(claim, sourceEmbedding)
            );

            case SAME_MANUFACTURER_AND_EQUIPMENT_TYPE -> new SearchCandidates(
                    SimilaritySearchMode.SAME_MANUFACTURER_AND_EQUIPMENT_TYPE, findSameManufacturerAndEquipmentType(claim, sourceEmbedding)
            );

            case SAME_EQUIPMENT_TYPE -> new SearchCandidates(
                    SimilaritySearchMode.SAME_EQUIPMENT_TYPE, findSameEquipmentType(claim, sourceEmbedding)
            );

            case SAME_MANUFACTURER -> new SearchCandidates(SimilaritySearchMode.SAME_MANUFACTURER, findSameManufacturer(claim, sourceEmbedding));

            case ALL -> new SearchCandidates(SimilaritySearchMode.ALL, findAll(claim, sourceEmbedding));

            case AUTO_HIERARCHICAL -> findAutoHierarchical(claim, sourceEmbedding);
        };
    }

    private SearchCandidates findAutoHierarchical(Claim claim, ClaimEmbedding sourceEmbedding) {

        List<ClaimEmbedding> sameModel = findSameModel(claim, sourceEmbedding);

        if (sameModel.size() >= minCandidates) {
            return new SearchCandidates(SimilaritySearchMode.SAME_MODEL, sameModel);
        }

        List<ClaimEmbedding> sameManufacturerAndEquipmentType =
                findSameManufacturerAndEquipmentType(claim, sourceEmbedding);

        if (sameManufacturerAndEquipmentType.size() >= minCandidates) {
            return new SearchCandidates(SimilaritySearchMode.SAME_MANUFACTURER_AND_EQUIPMENT_TYPE, sameManufacturerAndEquipmentType);
        }

        List<ClaimEmbedding> sameEquipmentType = findSameEquipmentType(claim, sourceEmbedding);
        if (sameEquipmentType.size() >= minCandidates) {
            return new SearchCandidates(SimilaritySearchMode.SAME_EQUIPMENT_TYPE, sameEquipmentType);
        }

        return new SearchCandidates(SimilaritySearchMode.ALL, findAll(claim, sourceEmbedding));
    }

    private List<ClaimEmbedding> findSameModel(Claim claim, ClaimEmbedding sourceEmbedding) {
        EquipmentModel model = claim.getEquipment().getModel();

        return claimEmbeddingRepository.findCandidatesBySameModel(
                claim.getId(),
                model.getId(),
                sourceEmbedding.getModelName(),
                sourceEmbedding.getDimension()
        );
    }

    private List<ClaimEmbedding> findSameManufacturerAndEquipmentType(Claim claim, ClaimEmbedding sourceEmbedding) {
        EquipmentModel model = claim.getEquipment().getModel();

        return claimEmbeddingRepository.findCandidatesBySameManufacturerAndEquipmentType(
                claim.getId(),
                model.getManufacturer(),
                model.getType(),
                sourceEmbedding.getModelName(),
                sourceEmbedding.getDimension()
        );
    }

    private List<ClaimEmbedding> findSameEquipmentType(Claim claim, ClaimEmbedding sourceEmbedding) {
        EquipmentModel model = claim.getEquipment().getModel();

        return claimEmbeddingRepository.findCandidatesBySameEquipmentType(
                claim.getId(),
                model.getType(),
                sourceEmbedding.getModelName(),
                sourceEmbedding.getDimension()
        );
    }

    private List<ClaimEmbedding> findSameManufacturer(Claim claim, ClaimEmbedding sourceEmbedding) {
        EquipmentModel model = claim.getEquipment().getModel();

        return claimEmbeddingRepository.findCandidatesBySameManufacturer(
                claim.getId(),
                model.getManufacturer(),
                sourceEmbedding.getModelName(),
                sourceEmbedding.getDimension()
        );
    }

    private List<ClaimEmbedding> findAll(Claim claim, ClaimEmbedding sourceEmbedding) {
        return claimEmbeddingRepository.findCandidatesAll(
                claim.getId(),
                sourceEmbedding.getModelName(),
                sourceEmbedding.getDimension()
        );
    }

    private ClaimEmbedding getSourceEmbedding(Claim claim) {
        return claimEmbeddingRepository.findById(claim.getId())
                .orElseThrow(() -> new NotFoundException("Embedding для цієї заявки не знайдено"));
    }

    private double cosineSimilarity(float[] a, float[] b) {
        if (a.length != b.length) {
            throw new BadRequestException("Розмірність embedding-векторів не збігається");
        }

        double dot = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }

        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private record SearchCandidates(SimilaritySearchMode resolvedMode, List<ClaimEmbedding> embeddings) {}

    public record SimilaritySearchResult(
            SimilaritySearchMode requestedMode,
            SimilaritySearchMode resolvedMode,
            List<SimilarClaim> similarClaims) {}

    public record SimilarClaim(Integer claimId, double score) {}
}