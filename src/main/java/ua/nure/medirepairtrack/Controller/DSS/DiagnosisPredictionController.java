package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.CreateManualPredictionDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.DiagnosisPredictionResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.UpdatePredictionDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionService;
import ua.nure.medirepairtrack.Service.DSS.PredictionAggregationService;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class DiagnosisPredictionController {

    private final DiagnosisPredictionService service;
    private final PredictionAggregationService predictionAggregationService;

    // Ручне створення прогнозу інженером
    @PostMapping("/manual")
    public DiagnosisPredictionResponseDTO createManual(@Valid @RequestBody CreateManualPredictionDTO dto) {
        return service.createManualPrediction(dto);
    }

    @PutMapping("/{predictionId}")
    public DiagnosisPredictionResponseDTO update(@PathVariable Integer predictionId, @Valid @RequestBody UpdatePredictionDTO dto) {
        return service.updatePrediction(predictionId, dto);
    }

    @DeleteMapping("/{predictionId}")
    public void delete(@PathVariable Integer predictionId) {
        service.deletePrediction(predictionId);
    }

    @PostMapping("/{predictionId}/recalculate")
    public void recalculatePredictions(@PathVariable Integer predictionId) {
        predictionAggregationService.recalculate(predictionId);
    }

    // Отримання конкретного прогнозу
    @GetMapping("/{predictionId}")
    public DiagnosisPredictionResponseDTO getById(@PathVariable Integer predictionId) {
        return service.getById(predictionId);
    }

    // Отримання прогнозів для конкретної діагностики
    @GetMapping("/diagnosis/{diagnosisId}")
    public List<DiagnosisPredictionResponseDTO> getAllByDiagnosisId(@PathVariable Integer diagnosisId) {
        return service.getAllByDiagnosisId(diagnosisId);
    }
}
