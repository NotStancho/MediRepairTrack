package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.CreateManualPredictionDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.DiagnosisPredictionResponseDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionService;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class DiagnosisPredictionController {

    private final DiagnosisPredictionService predictionService;

    // Ручне створення прогнозу інженером
    @PostMapping("/manual")
    public DiagnosisPredictionResponseDTO createManual(@Valid @RequestBody CreateManualPredictionDTO dto) {
        return predictionService.createManualPrediction(dto);
    }

    // Отримання конкретного прогнозу
    @GetMapping("/{predictionId}")
    public DiagnosisPredictionResponseDTO getById(@PathVariable Integer predictionId) {
        return predictionService.getById(predictionId);
    }

    // Отримання прогнозів для конкретної діагностики
    @GetMapping("/diagnosis/{diagnosisId}")
    public List<DiagnosisPredictionResponseDTO> getAllByDiagnosisId(@PathVariable Integer diagnosisId) {
        return predictionService.getAllByDiagnosisId(diagnosisId);
    }
}
