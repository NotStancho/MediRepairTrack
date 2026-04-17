package ua.nure.medirepairtrack.Listener.Diagnosis;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.CreateAutoDiagnosisDTO;
import ua.nure.medirepairtrack.Entity.Claim.Status;
import ua.nure.medirepairtrack.Event.Claim.ClaimStatusChangedEvent;
import ua.nure.medirepairtrack.Service.DiagnosisService;

@Component
@RequiredArgsConstructor
public class DiagnosisListener {
    private final DiagnosisService diagnosisService;

    @EventListener
    public void handleClaimAccepted(ClaimStatusChangedEvent event) {

        if (event.newStatus() != Status.ACCEPTED) {
            return;
        }

        CreateAutoDiagnosisDTO dto = new CreateAutoDiagnosisDTO();
        dto.setClaimId(event.claimId());

        diagnosisService.createAutoDiagnosis(dto);
    }
}
