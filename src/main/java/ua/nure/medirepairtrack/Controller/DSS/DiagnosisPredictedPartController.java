package ua.nure.medirepairtrack.Controller.DSS;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.CreatePredictedPartDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.PredictedPartResponseDTO;
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

    @GetMapping("/prediction/{predictionId}")
    public List<PredictedPartResponseDTO> getByPrediction(@PathVariable Integer predictionId) {
        return service.getByPrediction(predictionId);
    }

}