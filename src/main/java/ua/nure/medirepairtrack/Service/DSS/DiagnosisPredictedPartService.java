package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.CreatePredictedPartDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.PredictedPartResponseDTO;
import ua.nure.medirepairtrack.Entity.DSS.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPart;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPartId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.Part.Part;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedPartRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Repository.PartRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiagnosisPredictedPartService {

    private final DiagnosisPredictedPartRepository repository;
    private final DiagnosisPredictionRepository predictionRepository;
    private final PartRepository partRepository;

    @Transactional
    public PredictedPartResponseDTO create(CreatePredictedPartDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        Part part = partRepository.findById(dto.getPartId())
                .orElseThrow(() -> new NotFoundException("Запчастину не знайдено"));

        DiagnosisPredictedPart entity = DiagnosisPredictedPart.builder()
                        .id(new DiagnosisPredictedPartId(
                                dto.getPredictionId(),
                                dto.getPartId()
                        ))
                        .prediction(prediction)
                        .part(part)
                        .probabilityScore(dto.getProbabilityScore())
                        .rankPosition(dto.getRankPosition())
                        .createdAt(LocalDateTime.now())
                        .build();

        return map(repository.save(entity));
    }

    public List<PredictedPartResponseDTO> getByPrediction(Integer predictionId) {
        return repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    private PredictedPartResponseDTO map(DiagnosisPredictedPart e) {
        return PredictedPartResponseDTO.builder()
                .predictionId(e.getPrediction().getId())
                .partId(e.getPart().getId())
                .probabilityScore(e.getProbabilityScore())
                .rankPosition(e.getRankPosition())
                .createdAt(e.getCreatedAt())
                .build();
    }

}