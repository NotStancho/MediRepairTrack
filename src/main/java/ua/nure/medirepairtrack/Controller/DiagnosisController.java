package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.CreateAutoDiagnosisDTO;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.CreateManualDiagnosisDTO;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.DiagnosisResponseDTO;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.UpdateDiagnosisDTO;
import ua.nure.medirepairtrack.Service.DiagnosisService;

import java.util.List;

@RestController
@RequestMapping("/api/diagnosis")
@RequiredArgsConstructor
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    // Ручна діагностика інженером
    @PostMapping("/manual")
    public DiagnosisResponseDTO createManual(@Valid @RequestBody CreateManualDiagnosisDTO dto) {
        return diagnosisService.createManualDiagnosis(dto);
    }

    // Автоматична діагностика (DSS)
    @PostMapping("/auto")
    public DiagnosisResponseDTO createAuto(@Valid @RequestBody CreateAutoDiagnosisDTO dto) {
        return diagnosisService.createAutoDiagnosis(dto);
    }

    // Редагування діагностики
    @PutMapping("/{id}")
    public DiagnosisResponseDTO update(@PathVariable Integer id, @Valid @RequestBody UpdateDiagnosisDTO dto) {
        return diagnosisService.updateDiagnosis(id, dto);
    }

    // Підтвердження діагнозу
    @PostMapping("/{id}/confirm")
    public DiagnosisResponseDTO confirm(@PathVariable Integer id, @RequestParam Integer engineerId) {
        return diagnosisService.confirmDiagnosis(id, engineerId);
    }

    // Відхилення AI діагнозу
    @PostMapping("/{id}/reject")
    public DiagnosisResponseDTO reject(@PathVariable Integer id) {
        return diagnosisService.rejectDiagnosis(id);
    }

    // Архівація
    @PostMapping("/{id}/archive")
    public DiagnosisResponseDTO archive(@PathVariable Integer id) {
        return diagnosisService.archiveDiagnosis(id);
    }

    @GetMapping("/{id}")
    public DiagnosisResponseDTO getById(@PathVariable Integer id) {
        return diagnosisService.getDiagnosis(id);
    }

    @GetMapping("/claim/{claimId}")
    public List<DiagnosisResponseDTO> getByClaim(@PathVariable Integer claimId) {
        return diagnosisService.getClaimDiagnoses(claimId);
    }
}