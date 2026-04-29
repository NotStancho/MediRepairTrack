package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperationDTO.CreatePredictedOperationDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperationDTO.PredictedOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperationDTO.UpdatePredictedOperationDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.RepairWorkShortDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictedOperationService;

import java.util.List;

@RestController
@RequestMapping("/api/dss/predicted-operations")
@RequiredArgsConstructor
public class DiagnosisPredictedOperationController {

    private final DiagnosisPredictedOperationService service;

    @PostMapping
    public PredictedOperationResponseDTO create(@Valid @RequestBody CreatePredictedOperationDTO dto) {
        return service.create(dto);
    }

    @PostMapping("/batch")
    public List<PredictedOperationResponseDTO> createBatch(@RequestBody List<CreatePredictedOperationDTO> dtos) {
        return service.createBatch(dtos);
    }

    @PutMapping("/{predictionId}/{repairWorkId}")
    public PredictedOperationResponseDTO update(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId, @Valid @RequestBody UpdatePredictedOperationDTO dto) {
        return service.update(predictionId, repairWorkId, dto);
    }

    @DeleteMapping("/{predictionId}/{repairWorkId}")
    public void delete(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId) {
        service.delete(predictionId, repairWorkId);
    }

    @GetMapping("/prediction/{predictionId}")
    public List<PredictedOperationResponseDTO> getAllByPredictionId(@PathVariable Integer predictionId) {
        return service.getAllByPredictionId(predictionId);
    }

    @GetMapping("/prediction/{predictionId}/repair-work/{repairWorkId}")
    public PredictedOperationResponseDTO getById(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId) {
        return service.getById(predictionId, repairWorkId);
    }

    @GetMapping("/available/{predictionId}")
    public List<RepairWorkShortDTO> getAvailableOperations(@PathVariable Integer predictionId) {
        return service.getAvailableOperations(predictionId);
    }
}
