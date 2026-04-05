package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperation.CreatePredictedOperationDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperation.PredictedOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperation.UpdatePredictedOperationDTO;
import ua.nure.medirepairtrack.DTO.RepairOperation.RepairOperationShortDTO;
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

    @PutMapping("/{predictionId}/{operationId}")
    public PredictedOperationResponseDTO update(@PathVariable Integer predictionId, @PathVariable Integer operationId, @Valid @RequestBody UpdatePredictedOperationDTO dto) {
        return service.update(predictionId, operationId, dto);
    }

    @DeleteMapping("/{predictionId}/{operationId}")
    public void delete(@PathVariable Integer predictionId, @PathVariable Integer operationId) {
        service.delete(predictionId, operationId);
    }

    @GetMapping("/prediction/{predictionId}")
    public List<PredictedOperationResponseDTO> getAllByPredictionId(@PathVariable Integer predictionId) {
        return service.getAllByPredictionId(predictionId);
    }

    @GetMapping("/prediction/{predictionId}/operation/{operationId}")
    public PredictedOperationResponseDTO getById(@PathVariable Integer predictionId, @PathVariable Integer operationId) {
        return service.getById(predictionId, operationId);
    }

    @GetMapping("/available/{predictionId}")
    public List<RepairOperationShortDTO> getAvailableOperations(@PathVariable Integer predictionId) {
        return service.getAvailableOperations(predictionId);
    }
}