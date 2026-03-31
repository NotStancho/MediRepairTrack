package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.ClaimDTO.ClaimShortDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity.CreateSimilarityResultDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity.SimilarityResultResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity.UpdateSimilarityResultDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisSimilarityResultService;

import java.util.List;

@RestController
@RequestMapping("/api/dss/similarity-results")
@RequiredArgsConstructor
public class DiagnosisSimilarityResultController {

    private final DiagnosisSimilarityResultService service;

    @PostMapping
    public SimilarityResultResponseDTO create(@Valid @RequestBody CreateSimilarityResultDTO dto) {
        return service.create(dto);
    }
    @PostMapping("/batch")
    public List<SimilarityResultResponseDTO> createBatch(@RequestBody List<CreateSimilarityResultDTO> dtos) {
        return service.createBatch(dtos);
    }

    @PutMapping("/{predictionId}/{claimId}")
    public SimilarityResultResponseDTO update(@PathVariable Integer predictionId, @PathVariable Integer claimId, @Valid @RequestBody UpdateSimilarityResultDTO dto) {
        return service.update(predictionId, claimId, dto);
    }

    @DeleteMapping("/{predictionId}/{claimId}")
    public void delete(@PathVariable Integer predictionId, @PathVariable Integer claimId) {
        service.delete(predictionId, claimId);
    }

    @GetMapping("/prediction/{predictionId}")
    public List<SimilarityResultResponseDTO> getAllByPrediction(@PathVariable Integer predictionId) {
        return service.getAllByPredictionId(predictionId);
    }
    @GetMapping("/available/{predictionId}")
    public List<ClaimShortDTO> getAvailable(@PathVariable Integer predictionId) {
        return service.getAvailableClaims(predictionId);
    }
}
