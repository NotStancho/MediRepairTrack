package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO.CreatePredictedWorkPartDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO.PredictedWorkPartResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO.UpdatePredictedWorkPartDTO;
import ua.nure.medirepairtrack.DTO.repair.PartDTO.PartShortDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictedWorkPartService;

import java.util.List;

@RestController
@RequestMapping("/api/dss/predicted-work-parts")
@RequiredArgsConstructor
public class DiagnosisPredictedWorkPartController {

    private final DiagnosisPredictedWorkPartService service;

    @PostMapping
    public PredictedWorkPartResponseDTO create(@Valid @RequestBody CreatePredictedWorkPartDTO dto) {
        return service.create(dto);
    }
    @PostMapping("/batch")
    public List<PredictedWorkPartResponseDTO> createBatch(@RequestBody List<@Valid CreatePredictedWorkPartDTO> dtos) {
        return service.createBatch(dtos);
    }

    @PutMapping("/{predictionId}/{repairWorkId}/{partId}")
    public PredictedWorkPartResponseDTO update(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId, @PathVariable Integer partId, @Valid @RequestBody UpdatePredictedWorkPartDTO dto) {
        return service.update(predictionId, repairWorkId, partId, dto);
    }

    @DeleteMapping("/{predictionId}/{repairWorkId}/{partId}")
    public void delete(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId, @PathVariable Integer partId) {
        service.delete(predictionId, repairWorkId, partId);
    }

    @GetMapping("/prediction/{predictionId}")
    public List<PredictedWorkPartResponseDTO> getAllByPrediction(@PathVariable Integer predictionId) {
        return service.getAllByPredictionId(predictionId);
    }

    @GetMapping("/prediction/{predictionId}/work/{repairWorkId}")
    public List<PredictedWorkPartResponseDTO> getAllByPredictionWork(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId) {
        return service.getAllByPredictionWork(predictionId, repairWorkId);
    }

    @GetMapping("/prediction/{predictionId}/work/{repairWorkId}/part/{partId}")
    public PredictedWorkPartResponseDTO getById(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId, @PathVariable Integer partId) {
        return service.getById(predictionId, repairWorkId, partId);
    }

    @GetMapping("/available/{predictionId}/{repairWorkId}")
    public List<PartShortDTO> getAvailablePartsForPredictedWork(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId) {
        return service.getAvailablePartsForPredictedWork(predictionId, repairWorkId);
    }
}
