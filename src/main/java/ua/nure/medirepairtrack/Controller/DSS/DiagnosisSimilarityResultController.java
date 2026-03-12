package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity.CreateSimilarityResultDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity.SimilarityResultResponseDTO;
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

    @GetMapping("/prediction/{predictionId}")
    public List<SimilarityResultResponseDTO> getByPrediction(@PathVariable Integer predictionId) {
        return service.getByPrediction(predictionId);
    }
}
