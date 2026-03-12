package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity.CreateSimilarityResultDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity.SimilarityResultResponseDTO;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarityResult;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarityResultId;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisSimilarityResultRepository;
import ua.nure.medirepairtrack.Service.ClaimService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiagnosisSimilarityResultService {

    private final DiagnosisSimilarityResultRepository diagnosisSimilarityResultRepository;

    private final ClaimService claimService;

    private final SimilaritySearchService similaritySearchService;

    private final DiagnosisPredictionRepository predictionRepository;


    @Transactional
    public SimilarityResultResponseDTO create(CreateSimilarityResultDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Prediction not found"));

        Claim claim = claimService.getClaim(dto.getSimilarClaimId());

        DiagnosisSimilarityResult entity =
                DiagnosisSimilarityResult.builder()
                        .id(new DiagnosisSimilarityResultId(
                                dto.getPredictionId(),
                                dto.getSimilarClaimId()
                        ))
                        .prediction(prediction)
                        .similarClaim(claim)
                        .similarityScore(dto.getSimilarityScore())
                        .rankPosition(dto.getRankPosition())
                        .createdAt(LocalDateTime.now())
                        .build();

        return map(diagnosisSimilarityResultRepository.save(entity));
    }

    @Transactional
    public void generateSimilarityResults(DiagnosisPrediction prediction) {

        Claim claim = prediction.getDiagnosis().getClaim();

        List<SimilaritySearchService.SimilarClaim> similarClaims = similaritySearchService.findSimilarClaims(claim);

        int rank = 1;

        for (var sc : similarClaims) {

            CreateSimilarityResultDTO dto = new CreateSimilarityResultDTO();
            dto.setPredictionId(prediction.getId());
            dto.setSimilarClaimId(sc.claimId());
            dto.setSimilarityScore(BigDecimal.valueOf(sc.score()));
            dto.setRankPosition(rank++);

            create(dto);
        }
    }

    public List<SimilarityResultResponseDTO> getByPrediction(Integer predictionId) {

        return diagnosisSimilarityResultRepository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    private SimilarityResultResponseDTO map(DiagnosisSimilarityResult e) {

        return SimilarityResultResponseDTO.builder()
                .predictionId(e.getPrediction().getId())
                .claimId(e.getSimilarClaim().getId())
                .similarityScore(e.getSimilarityScore())
                .rankPosition(e.getRankPosition())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
