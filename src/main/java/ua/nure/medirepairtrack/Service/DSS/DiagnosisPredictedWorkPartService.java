package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO.CreatePredictedWorkPartDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO.PredictedWorkPartResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO.UpdatePredictedWorkPartDTO;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.PartShortDTO;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWork.DiagnosisPredictedWork;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWork.DiagnosisPredictedWorkId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWorkPart.DiagnosisPredictedWorkPart;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWorkPart.DiagnosisPredictedWorkPartId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.diagnosis.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.repair.Part.Part;
import ua.nure.medirepairtrack.Entity.repair.Part.UnitType;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedWorkPartRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedWorkRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Repository.claim.ClaimWorkPartRepository;
import ua.nure.medirepairtrack.Service.repair.PartService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiagnosisPredictedWorkPartService {
    @Value("${dss.predicted-work-parts.top-k}")
    private int topK;

    @Value("${dss.predicted-work-parts.min-probability}")
    private double minProbability;

    private final DiagnosisPredictedWorkPartRepository repository;
    private final DiagnosisPredictedWorkRepository predictedWorkRepository;

    private final PartService partService;
    private final ClaimWorkPartRepository claimWorkPartRepository;
    private final DiagnosisSimilarityResultService similarityResultService;

    private final PredictionStateService predictionStateService;
    private final DiagnosisPredictionRepository predictionRepository;


    private final DiagnosisPermissionService permissionService;

    @Transactional
    public PredictedWorkPartResponseDTO create(CreatePredictedWorkPartDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        Diagnosis diagnosis = prediction.getDiagnosis();

        permissionService.validateEditable(diagnosis, "додавати прогнозовані запчастини до прогнозованої роботи");

        DiagnosisPredictedWorkId predictedWorkId = new DiagnosisPredictedWorkId(
                dto.getPredictionId(),
                dto.getRepairWorkId()
        );

        DiagnosisPredictedWork predictedWork = predictedWorkRepository.findById(predictedWorkId)
                .orElseThrow(() -> new NotFoundException("Прогнозовану ремонтну роботу не знайдено"));

        Part part = partService.getPartEntity(dto.getPartId());

        DiagnosisPredictedWorkPartId id = new DiagnosisPredictedWorkPartId(
                dto.getPredictionId(),
                dto.getRepairWorkId(),
                dto.getPartId()
        );

        if (repository.existsById(id)) {
            throw new BadRequestException("Ця запчастина вже додана до прогнозованої роботи");
        }

        Integer maxRank = repository.findMaxRankByPredictionIdAndRepairWorkId(
                dto.getPredictionId(),
                dto.getRepairWorkId()
        );

        int newRank = (maxRank != null ? maxRank : 0) + 1;

        DiagnosisPredictedWorkPart entity = DiagnosisPredictedWorkPart.builder()
                .id(id)
                .predictedWork(predictedWork)
                .part(part)
                .predictedQuantity(dto.getPredictedQuantity())
                .probabilityScore(dto.getProbabilityScore())
                .rankPosition(newRank)
                .createdAt(LocalDateTime.now())
                .build();

        DiagnosisPredictedWorkPart saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public List<PredictedWorkPartResponseDTO> createBatch(List<CreatePredictedWorkPartDTO> dtos) {
        return dtos.stream()
                .map(this::create)
                .toList();
    }

    // DO NOT mark as HYBRID - system generated
    @Transactional
    public void generatePredictedWorkParts(DiagnosisPrediction prediction) {

        Integer predictionId = prediction.getId();

        // 1. Отримуємо всі прогнозовані ремонтні роботи для цього прогнозу.
        // Запчастини прогнозуються не просто для всієї заявки,
        // а окремо для кожної прогнозованої роботи.
        var predictedWorks = predictedWorkRepository
                .findByPredictionIdOrderByRankPosition(predictionId);

        if (predictedWorks.isEmpty()) {
            return;
        }

        // 2. Отримуємо схожі історичні заявки, знайдені через semantic similarity.
        // Кожна схожа заявка має similarity_score, який використовується як вага.
        var similarityResults = similarityResultService.getAllByPredictionId(predictionId);

        if (similarityResults.isEmpty()) {
            return;
        }

        // 3. Для кожної прогнозованої роботи окремо прогнозуємо запчастини.
        for (DiagnosisPredictedWork predictedWork : predictedWorks) {

            Integer repairWorkId = predictedWork.getId().getRepairWorkId();

            // partScores:
            // partId -> сумарна вага появи запчастини у схожих заявках.
            //
            // Наприклад:
            // Part A зустрілася у заявках зі схожістю 0.90 і 0.75,
            // тоді score = 1.65.
            Map<Integer, Double> partScores = new HashMap<>();

            // weightedQuantitySums:
            // partId -> сума quantity * similarity.
            //
            // Потрібно для обчислення прогнозованої кількості запчастини.
            // Тобто більш схожі заявки сильніше впливають на кількість.
            Map<Integer, BigDecimal> weightedQuantitySums = new HashMap<>();

            // 4. Проходимо по кожній схожій заявці.
            for (var result : similarityResults) {

                Integer similarClaimId = result.getClaim().getId();
                BigDecimal similarityDecimal = result.getSimilarityScore();
                double similarity = similarityDecimal.doubleValue();

                // 5. Беремо запчастини тільки з тих claim_work,
                // які відповідають поточній прогнозованій ремонтній роботі.
                //
                // Тобто:
                // similar claim + repairWorkId -> used claim_work_part
                //
                // Це важливо, бо одна заявка може містити багато різних робіт,
                // і запчастини треба прив'язувати саме до відповідної роботи.
                var claimWorkParts = claimWorkPartRepository.findByClaimWorkClaimIdAndClaimWorkRepairWorkId(similarClaimId, repairWorkId);

                // 6. Агрегуємо запчастини з цієї схожої заявки.
                for (var claimWorkPart : claimWorkParts) {

                    Integer partId = claimWorkPart.getPart().getId();
                    BigDecimal quantity = claimWorkPart.getQuantity();

                    // 6.1. Додаємо similarity до загального score запчастини.
                    // Чим частіше запчастина зустрічається у схожих заявках
                    // і чим ці заявки більш схожі, тим вища її ймовірність.
                    partScores.merge(partId, similarity, Double::sum);

                    // 6.2. Додаємо quantity з вагою similarity.
                    // Це дозволяє потім порахувати weighted average:
                    // predictedQuantity = sum(quantity * similarity) / sum(similarity)
                    BigDecimal weightedQuantity = quantity.multiply(similarityDecimal);
                    weightedQuantitySums.merge(partId, weightedQuantity, BigDecimal::add);
                }
            }

            // 7. Якщо для цієї прогнозованої роботи у схожих заявках
            // не знайшлося жодної запчастини — переходимо до наступної роботи.
            if (partScores.isEmpty()) {
                continue;
            }

            // 8. Загальна сума score потрібна для нормалізації ймовірностей.
            // probabilityScore = partScore / totalScore
            double totalScore = partScores.values()
                    .stream()
                    .mapToDouble(Double::doubleValue)
                    .sum();

            // Захист від ділення на нуль у випадку некоректних/нульових similarity_score.
            if (totalScore == 0) {
                continue;
            }

            // 9. Сортуємо запчастини за спаданням score
            // і залишаємо тільки top-K найімовірніших.
            List<Map.Entry<Integer, Double>> ranked = partScores.entrySet()
                    .stream()
                    .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                    .limit(topK)
                    .toList();

            int rank = 1;

            // 10. Формуємо записи diagnosis_predicted_work_part.
            for (var entry : ranked) {

                Integer partId = entry.getKey();
                double score = entry.getValue();

                // 10.1. Обчислюємо ймовірність запчастини серед усіх кандидатів
                // для поточної прогнозованої роботи.
                BigDecimal probability = BigDecimal.valueOf(score)
                        .divide(BigDecimal.valueOf(totalScore), 4, RoundingMode.HALF_UP);

                // 10.2. Відсікаємо занадто слабкі прогнози.
                if (probability.doubleValue() < minProbability) {
                    continue;
                }

                BigDecimal weightedQuantitySum = weightedQuantitySums.get(partId);

                Part part = partService.getPartEntity(partId);

                // 10.3. Обчислюємо прогнозовану кількість як weighted average:
                //
                // predictedQuantity =
                //     sum(quantity_from_similar_claim * similarity)
                //     /
                //     sum(similarity_for_this_part)
                //
                // Тобто більш схожі заявки сильніше впливають на кількість.
                BigDecimal rawPredictedQuantity = weightedQuantitySum.divide(
                        BigDecimal.valueOf(score),
                        3,
                        RoundingMode.HALF_UP
                );

                // 10.4. Нормалізуємо кількість відповідно до типу одиниці:
                // - PIECE -> ціле значення, наприклад 1, 2, 3
                // - FRACTIONAL -> допускаємо дробове значення, наприклад 0.250
                BigDecimal predictedQuantity = normalizePredictedQuantity(part, rawPredictedQuantity);

                // 10.5. Зберігаємо прогнозовану запчастину для конкретної
                // прогнозованої роботи.
                DiagnosisPredictedWorkPart entity = DiagnosisPredictedWorkPart.builder()
                        .id(new DiagnosisPredictedWorkPartId(
                                predictionId,
                                repairWorkId,
                                partId
                        ))
                        .predictedWork(predictedWork)
                        .part(part)
                        .predictedQuantity(predictedQuantity)
                        .probabilityScore(probability)
                        .rankPosition(rank++)
                        .createdAt(LocalDateTime.now())
                        .build();

                repository.save(entity);
            }
        }
    }

    @Transactional
    public PredictedWorkPartResponseDTO update(Integer predictionId, Integer repairWorkId,
                                               Integer partId, UpdatePredictedWorkPartDTO dto) {

        DiagnosisPredictedWorkPartId id = new DiagnosisPredictedWorkPartId(predictionId, repairWorkId, partId);

        DiagnosisPredictedWorkPart entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Прогнозовану запчастину для роботи не знайдено"));

        DiagnosisPrediction prediction = entity.getPredictedWork().getPrediction();

        permissionService.validateEditable(prediction.getDiagnosis(), "редагувати прогнозовану запчастину роботи");

        if (dto.getPredictedQuantity() != null) {
            entity.setPredictedQuantity(dto.getPredictedQuantity());
        }

        if (dto.getProbabilityScore() != null) {
            entity.setProbabilityScore(dto.getProbabilityScore());
        }

        DiagnosisPredictedWorkPart saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public void delete(Integer predictionId, Integer repairWorkId, Integer partId) {

        DiagnosisPredictedWorkPartId id = new DiagnosisPredictedWorkPartId(predictionId, repairWorkId, partId);

        DiagnosisPredictedWorkPart diagnosisPredictedWorkPart = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Прогнозовану запчастину для роботи не знайдено"));

        DiagnosisPrediction prediction = diagnosisPredictedWorkPart.getPredictedWork().getPrediction();

        permissionService.validateEditable(prediction.getDiagnosis(), "видаляти прогнозовану запчастину роботи");

        repository.deleteById(diagnosisPredictedWorkPart.getId());

        predictionStateService.markAsHybridIfNeeded(prediction);
    }

    public List<PredictedWorkPartResponseDTO> getAllByPredictionId(Integer predictionId) {
        return repository.findByIdPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    public List<PredictedWorkPartResponseDTO> getAllByPredictionWork(Integer predictionId, Integer repairWorkId) {
        return repository.findByIdPredictionIdAndIdRepairWorkIdOrderByRankPosition(predictionId, repairWorkId)
                .stream()
                .map(this::map)
                .toList();
    }

    public PredictedWorkPartResponseDTO getById(Integer predictionId, Integer repairWorkId, Integer partId) {

        DiagnosisPredictedWorkPartId id =
                new DiagnosisPredictedWorkPartId(predictionId, repairWorkId, partId);

        return repository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Прогнозовану запчастину для роботи не знайдено"));
    }

    public List<PartShortDTO> getAvailablePartsForPredictedWork(Integer predictionId, Integer repairWorkId) {

        DiagnosisPredictedWorkId predictedWorkId = new DiagnosisPredictedWorkId(predictionId, repairWorkId);

        predictedWorkRepository.findById(predictedWorkId)
                        .orElseThrow(() -> new NotFoundException("Прогнозовану ремонтну роботу не знайдено"));

        // уже використані
        var usedPartIds = repository.findByIdPredictionIdAndIdRepairWorkIdOrderByRankPosition(predictionId, repairWorkId)
                .stream()
                .map(e -> e.getPart().getId())
                .collect(Collectors.toSet());

        return partService.getAllPartsShort().stream()
                .filter(p -> !usedPartIds.contains(p.getId()))
                .toList();
    }

    private BigDecimal normalizePredictedQuantity(Part part, BigDecimal rawQuantity) {
        if (rawQuantity == null || rawQuantity.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ONE;
        }

        // Для штучних запчастин не можна прогнозувати 1.333 шт.
        // Тому округлюємо до цілого значення.
        //
        // Для дробових матеріалів/витратників залишаємо точність до 3 знаків,
        // бо БД зберігає DECIMAL(10,3).
        if (part.getUnitType() == UnitType.PIECE) {
            return rawQuantity.setScale(0, RoundingMode.CEILING);
        }

        return rawQuantity.setScale(3, RoundingMode.HALF_UP);
    }

    private PredictedWorkPartResponseDTO map(DiagnosisPredictedWorkPart e) {
        return PredictedWorkPartResponseDTO.builder()
                .predictionId(e.getId().getPredictionId())
                .repairWorkId(e.getId().getRepairWorkId())
                .part(
                        PartShortDTO.builder()
                                .id(e.getPart().getId())
                                .partCode(e.getPart().getPartCode())
                                .partName(e.getPart().getPartName())
                                .stockQuantity(e.getPart().getStockQuantity())
                                .price(e.getPart().getPrice())
                                .unitName(e.getPart().getUnitName())
                                .unitType(e.getPart().getUnitType())
                                .build()
                )
                .predictedQuantity(e.getPredictedQuantity())
                .probabilityScore(e.getProbabilityScore())
                .rankPosition(e.getRankPosition())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
