package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.claim.ClaimDTO.ClaimShortDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarityDTO.CreateSimilarityResultDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarityDTO.SimilarityResultResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarityDTO.UpdateSimilarityResultDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarity.DiagnosisSimilarityResult;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisSimilarity.DiagnosisSimilarityResultId;
import ua.nure.medirepairtrack.Entity.diagnosis.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisSimilarityResultRepository;
import ua.nure.medirepairtrack.Service.claim.ClaimService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiagnosisSimilarityResultService {

    private final DiagnosisSimilarityResultRepository diagnosisSimilarityResultRepository;

    private final ClaimService claimService;

    private final SimilaritySearchService similaritySearchService;

    private final DiagnosisPredictionRepository predictionRepository;

    private final PredictionStateService predictionStateService;
    private final DiagnosisPermissionService permissionService;


    @Transactional
    public SimilarityResultResponseDTO create(CreateSimilarityResultDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдений"));

        Diagnosis diagnosis = prediction.getDiagnosis();

        permissionService.validateEditable(diagnosis, "додавати схожі заявки");

        Claim claim = claimService.getClaim(dto.getSimilarClaimId());

        if (diagnosis.getClaim().getId().equals(dto.getSimilarClaimId())) {
            throw new OperationNotAllowedException("Не можна додати поточну заявку як схожу");
        }

        if (diagnosisSimilarityResultRepository.existsById(new DiagnosisSimilarityResultId(dto.getPredictionId(), dto.getSimilarClaimId()))) {
            throw new OperationNotAllowedException("Ця схожа заявка вже додана");
        }

        Integer maxRank = diagnosisSimilarityResultRepository
                .findMaxRankByPredictionId(dto.getPredictionId());

        int newRank = (maxRank != null ? maxRank : 0) + 1;

        DiagnosisSimilarityResult entity =
                DiagnosisSimilarityResult.builder()
                        .id(new DiagnosisSimilarityResultId(
                                dto.getPredictionId(),
                                dto.getSimilarClaimId()
                        ))
                        .prediction(prediction)
                        .similarClaim(claim)
                        .similarityScore(dto.getSimilarityScore())
                        .rankPosition(newRank)
                        .createdAt(LocalDateTime.now())
                        .build();

        DiagnosisSimilarityResult saved = diagnosisSimilarityResultRepository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public List<SimilarityResultResponseDTO> createBatch(List<CreateSimilarityResultDTO> dtos) {
        return dtos.stream()
                .map(this::create) // reuse логіки
                .toList();
    }

    // DO NOT mark as HYBRID - system generated
    @Transactional
    public void generateSimilarityResults(DiagnosisPrediction prediction) {

        Claim claim = prediction.getDiagnosis().getClaim();

        List<SimilaritySearchService.SimilarClaim> similarClaims = similaritySearchService.findSimilarClaims(claim);

        int rank = 1;

        for (var sc : similarClaims) {

            DiagnosisSimilarityResult entity =
                    DiagnosisSimilarityResult.builder()
                            .id(new DiagnosisSimilarityResultId(
                                    prediction.getId(),
                                    sc.claimId()
                            ))
                            .prediction(prediction)
                            .similarClaim(claimService.getClaim(sc.claimId()))
                            .similarityScore(BigDecimal.valueOf(sc.score()))
                            .rankPosition(rank++)
                            .createdAt(LocalDateTime.now())
                            .build();

            diagnosisSimilarityResultRepository.save(entity);
        }
    }

    @Transactional
    public SimilarityResultResponseDTO update(Integer predictionId, Integer claimId, UpdateSimilarityResultDTO dto) {

        DiagnosisSimilarityResultId id =
                new DiagnosisSimilarityResultId(predictionId, claimId);

        DiagnosisSimilarityResult entity =
                diagnosisSimilarityResultRepository.findById(id)
                        .orElseThrow(() -> new NotFoundException("Схожу заявку не знайдено"));

        DiagnosisPrediction prediction = entity.getPrediction();

        permissionService.validateEditable(prediction.getDiagnosis(), "редагувати схожі заявки");

        if (dto.getSimilarityScore() != null) {
            entity.setSimilarityScore(dto.getSimilarityScore());
        }

        DiagnosisSimilarityResult saved = diagnosisSimilarityResultRepository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public void delete(Integer predictionId, Integer claimId) {

        DiagnosisPrediction prediction = predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдений"));

        permissionService.validateEditable(prediction.getDiagnosis(), "видаляти схожі заявки");

        diagnosisSimilarityResultRepository.deleteById(
                new DiagnosisSimilarityResultId(predictionId, claimId)
        );

        predictionStateService.markAsHybridIfNeeded(prediction);
    }

    public List<SimilarityResultResponseDTO> getAllByPredictionId(Integer predictionId) {

        return diagnosisSimilarityResultRepository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    public SimilarityResultResponseDTO getById(Integer predictionId, Integer claimId) {

        DiagnosisSimilarityResultId id =
                new DiagnosisSimilarityResultId(predictionId, claimId);

        return diagnosisSimilarityResultRepository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Схожу заявку не знайдено"));
    }

    public List<ClaimShortDTO> getAvailableClaims(Integer predictionId) {

        DiagnosisPrediction prediction = predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдений"));

        Integer currentClaimId = prediction.getDiagnosis().getClaim().getId();

        // вже додані
        Set<Integer> usedClaimIds = diagnosisSimilarityResultRepository
                .findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(r -> r.getSimilarClaim().getId())
                .collect(Collectors.toSet());

        return claimService.getAllClaimsShort().stream()
                .filter(c -> !c.getId().equals(currentClaimId)) // не саму себе
                .filter(c -> !usedClaimIds.contains(c.getId())) // не дублікати
                .toList();
    }

    private SimilarityResultResponseDTO map(DiagnosisSimilarityResult e) {

        return SimilarityResultResponseDTO.builder()
                .predictionId(e.getPrediction().getId())
                .claim(
                        ClaimShortDTO.builder()
                                .id(e.getSimilarClaim().getId())
                                .equipmentModel(e.getSimilarClaim().getEquipment().getModel().getModelName())
                                .serialNumber(e.getSimilarClaim().getEquipment().getSerialNumber())
                                .defectDescription(e.getSimilarClaim().getDefectDescription())
                                .repairType(e.getSimilarClaim().getRepairType().name())
                                .status(e.getSimilarClaim().getStatus().name())
                                .createdAt(e.getSimilarClaim().getCreatedAt())
                                .build()
                )
                .similarityScore(e.getSimilarityScore())
                .rankPosition(e.getRankPosition())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
