package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.Client.GeminiEmbedded.GeminiEmbeddingClient;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.DSS.ClaimEmbedding.ClaimEmbedding;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.ClaimEmbeddingRepository;
import ua.nure.medirepairtrack.Repository.claim.ClaimRepository;
import ua.nure.medirepairtrack.util.EmbeddingConverter;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmbeddingService {

    private final GeminiEmbeddingClient geminiClient;
    private final ClaimEmbeddingRepository claimEmbeddingRepository;
    private final ClaimRepository claimRepository;

    @Transactional
    public void generateIfMissing(Integer claimId) {

        if (claimEmbeddingRepository.existsById(claimId)) {
            return;
        }

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NotFoundException("Заявка не знайдена"));

        generateEmbedding(claim);
    }

    @Transactional
    public void regenerateEmbedding(Claim claim) {

        if (claimEmbeddingRepository.existsById(claim.getId())) {
            claimEmbeddingRepository.deleteById(claim.getId());
        }

        generateEmbedding(claim);
    }

    private void generateEmbedding(Claim claim) {

        String symptomText = claim.getDefectDescription();

        List<Double> embeddingVector = geminiClient.embed(symptomText);

        byte[] embeddingBytes = EmbeddingConverter.toByteArray(embeddingVector);

        ClaimEmbedding embedding = ClaimEmbedding.builder()
                .claim(claim)
                .embeddingVector(embeddingBytes)
                .dimension(embeddingVector.size())
                .modelName("gemini-embedding-001")
                .createdAt(LocalDateTime.now())
                .build();

        claimEmbeddingRepository.save(embedding);
    }
}