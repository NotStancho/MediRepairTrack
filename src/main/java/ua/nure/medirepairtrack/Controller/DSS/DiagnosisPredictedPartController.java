package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.CreatePredictedPartDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.PredictedPartResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.UpdatePredictedPartDTO;
import ua.nure.medirepairtrack.DTO.PartDTO.PartShortDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictedPartService;

import java.util.List;

@RestController
@RequestMapping("/api/dss/predicted-parts")
@RequiredArgsConstructor
public class DiagnosisPredictedPartController {

    private final DiagnosisPredictedPartService service;

    @PostMapping
    public PredictedPartResponseDTO create(@Valid @RequestBody CreatePredictedPartDTO dto) {
        return service.create(dto);
    }
    @PostMapping("/batch")
    public List<PredictedPartResponseDTO> createBatch(@RequestBody List<CreatePredictedPartDTO> dtos) {
        return service.createBatch(dtos);
    }

    @PutMapping("/{predictionId}/{partId}")
    public PredictedPartResponseDTO update(@PathVariable Integer predictionId, @PathVariable Integer partId, @Valid @RequestBody UpdatePredictedPartDTO dto) {
        return service.update(predictionId, partId, dto);
    }

    @DeleteMapping("/{predictionId}/{partId}")
    public void delete(@PathVariable Integer predictionId, @PathVariable Integer partId) {
        service.delete(predictionId, partId);
    }

    @GetMapping("/prediction/{predictionId}")
    public List<PredictedPartResponseDTO> getAllByPrediction(@PathVariable Integer predictionId) {
        return service.getAllByPredictionId(predictionId);
    }

    @GetMapping("/prediction/{predictionId}/part/{partId}")
    public PredictedPartResponseDTO getById(@PathVariable Integer predictionId, @PathVariable Integer partId) {
        return service.getById(predictionId, partId);
    }

    @GetMapping("/available/{predictionId}")
    public List<PartShortDTO> getAvailableParts(@PathVariable Integer predictionId) {
        return service.getAvailableParts(predictionId);
    }
}