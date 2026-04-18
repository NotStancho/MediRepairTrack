package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
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

    public List<SimilarClaim> findSimilarClaims(Claim claim) {

        List<SimilarClaim> results = vectorSearch(claim);

        return results.stream()
                .filter(r -> r.score() >= threshold)
                .sorted(Comparator.comparing(SimilarClaim::score).reversed())
                .limit(topK)
                .toList();
    }

    private List<SimilarClaim> vectorSearch(Claim claim) {

        var sourceEmbedding = claimEmbeddingRepository.findById(claim.getId())
                .orElseThrow(() -> new NotFoundException("Embedding для цієї заявки не знайдено"));

        float[] sourceVector = EmbeddingConverter.fromByteArray(sourceEmbedding.getContextEmbedding());

        return claimEmbeddingRepository.findByClaimIdNot(claim.getId())
                .stream()
                .map(e -> {

                    float[] targetVector = EmbeddingConverter.fromByteArray(e.getContextEmbedding());

                    double score = cosineSimilarity(sourceVector, targetVector);

                    return new SimilarClaim(e.getClaimId(), score);
                })
                .toList();
    }

    private double cosineSimilarity(float[] a, float[] b) {

        double dot = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < a.length; i++) {

            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    public record SimilarClaim(Integer claimId, double score) {}
}
