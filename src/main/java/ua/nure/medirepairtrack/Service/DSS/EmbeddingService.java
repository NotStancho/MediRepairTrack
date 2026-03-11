package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.Client.Gemini.GeminiEmbeddingClient;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.ClaimEmbedding.ClaimEmbedding;
import ua.nure.medirepairtrack.Repository.ClaimEmbeddingRepository;
import ua.nure.medirepairtrack.util.EmbeddingConverter;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmbeddingService {

    private final GeminiEmbeddingClient geminiClient;
    private final ClaimEmbeddingRepository claimEmbeddingRepository;

    @Transactional
    public void generateIfMissing(Claim claim) {

        if (claimEmbeddingRepository.existsById(claim.getId())) {
            return;
        }

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
        String contextText = buildContextText(claim);

        List<Double> symptomVector = geminiClient.embed(symptomText);
        List<Double> contextVector = geminiClient.embed(contextText);

        byte[] symptomBytes = EmbeddingConverter.toByteArray(symptomVector);
        byte[] contextBytes = EmbeddingConverter.toByteArray(contextVector);

        ClaimEmbedding embedding = ClaimEmbedding.builder()
                .claim(claim)
                .symptomEmbedding(symptomBytes)
                .symptomDimension(symptomVector.size())
                .contextEmbedding(contextBytes)
                .contextDimension(contextVector.size())
                .modelName("gemini-embedding-001")
                .createdAt(LocalDateTime.now())
                .build();

        claimEmbeddingRepository.save(embedding);
    }

    private String buildContextText(Claim claim) {

        var equipment = claim.getEquipment();
        var model = equipment.getModel();

        return """
            Equipment type: %s
            Manufacturer: %s
            Model: %s

            Defect description:
            %s
            """.formatted(
                model.getType(),
                model.getManufacturer(),
                model.getModelName(),
                claim.getDefectDescription()
        );
    }
}