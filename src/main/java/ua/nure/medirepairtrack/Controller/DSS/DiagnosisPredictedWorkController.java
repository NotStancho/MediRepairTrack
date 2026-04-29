package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO.CreatePredictedWorkDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO.PredictedWorkResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO.UpdatePredictedWorkDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.RepairWorkShortDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictedWorkService;

import java.util.List;

@RestController
@RequestMapping("/api/dss/predicted-works")
@RequiredArgsConstructor
public class DiagnosisPredictedWorkController {

    private final DiagnosisPredictedWorkService service;

    @PostMapping
    public PredictedWorkResponseDTO create(@Valid @RequestBody CreatePredictedWorkDTO dto) {
        return service.create(dto);
    }

    @PostMapping("/batch")
    public List<PredictedWorkResponseDTO> createBatch(@RequestBody List<CreatePredictedWorkDTO> dtos) {
        return service.createBatch(dtos);
    }

    @PutMapping("/{predictionId}/{repairWorkId}")
    public PredictedWorkResponseDTO update(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId, @Valid @RequestBody UpdatePredictedWorkDTO dto) {
        return service.update(predictionId, repairWorkId, dto);
    }

    @DeleteMapping("/{predictionId}/{repairWorkId}")
    public void delete(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId) {
        service.delete(predictionId, repairWorkId);
    }

    @GetMapping("/prediction/{predictionId}")
    public List<PredictedWorkResponseDTO> getAllByPredictionId(@PathVariable Integer predictionId) {
        return service.getAllByPredictionId(predictionId);
    }

    @GetMapping("/prediction/{predictionId}/repair-work/{repairWorkId}")
    public PredictedWorkResponseDTO getById(@PathVariable Integer predictionId, @PathVariable Integer repairWorkId) {
        return service.getById(predictionId, repairWorkId);
    }

    @GetMapping("/available/{predictionId}")
    public List<RepairWorkShortDTO> getAvailableWorks(@PathVariable Integer predictionId) {
        return service.getAvailableWorks(predictionId);
    }
}
