package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.PredictedDefect.CreatePredictedDefectDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedDefect.PredictedDefectResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedDefect.UpdatePredictedDefectDTO;
import ua.nure.medirepairtrack.DTO.DefectCategoryDTO.DefectCategoryShortResponseDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionDefectService;

import java.util.List;

@RestController
@RequestMapping("/api/dss/predicted-defects")
@RequiredArgsConstructor
public class DiagnosisPredictionDefectController {

    private final DiagnosisPredictionDefectService service;

    @PostMapping
    public PredictedDefectResponseDTO create(@Valid @RequestBody CreatePredictedDefectDTO dto) {
        return service.create(dto);
    }

    @PostMapping("/batch")
    public List<PredictedDefectResponseDTO> createBatch(@RequestBody List<CreatePredictedDefectDTO> dtos) {
        return service.createBatch(dtos);
    }

    @PutMapping("/{predictionId}/{defectCategoryId}")
    public PredictedDefectResponseDTO update(@PathVariable Integer predictionId, @PathVariable Integer defectCategoryId, @Valid @RequestBody UpdatePredictedDefectDTO dto) {
        return service.update(predictionId, defectCategoryId, dto);
    }

    @DeleteMapping("/{predictionId}/{defectCategoryId}")
    public void delete(@PathVariable Integer predictionId, @PathVariable Integer defectCategoryId) {
        service.delete(predictionId, defectCategoryId);
    }

    @GetMapping("/prediction/{predictionId}")
    public List<PredictedDefectResponseDTO> getAllByPredictionId(@PathVariable Integer predictionId) {
        return service.getAllByPredictionId(predictionId);
    }

    @GetMapping("/prediction/{predictionId}/defect/{defectCategoryId}")
    public PredictedDefectResponseDTO getById(@PathVariable Integer predictionId, @PathVariable Integer defectCategoryId) {
        return service.getById(predictionId, defectCategoryId);
    }

    @GetMapping("/available/{predictionId}")
    public List<DefectCategoryShortResponseDTO> getAvailableDefects(@PathVariable Integer predictionId) {
        return service.getAvailableDefects(predictionId);
    }
}
