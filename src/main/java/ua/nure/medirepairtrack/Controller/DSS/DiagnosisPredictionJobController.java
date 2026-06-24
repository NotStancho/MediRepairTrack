package ua.nure.medirepairtrack.Controller.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionJobDTO.DiagnosisPredictionJobResponseDTO;
import ua.nure.medirepairtrack.Service.DSS.DiagnosisPredictionJobService;

@RestController
@RequestMapping("/api/prediction-jobs")
@RequiredArgsConstructor
public class DiagnosisPredictionJobController {

    private final DiagnosisPredictionJobService service;

    @GetMapping("/diagnosis/{diagnosisId}")
    public ResponseEntity<DiagnosisPredictionJobResponseDTO> getCurrentByDiagnosisId(@PathVariable Integer diagnosisId) {
        return service.getCurrentByDiagnosisId(diagnosisId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping(value = "/diagnosis/{diagnosisId}/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Integer diagnosisId) {
        return service.subscribe(diagnosisId);
    }
}
