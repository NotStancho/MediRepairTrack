package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.Entity.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Workflow.DiagnosisStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

@Service
@RequiredArgsConstructor
public class DiagnosisPermissionService {

    private final DiagnosisStatusMachine diagnosisStatusMachine;

    public void validateEditable(Diagnosis diagnosis, String action) {
        if (!diagnosisStatusMachine.allowsDiagnosisEdit(diagnosis.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            action,
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisEditStatuses()
                    )
            );
        }
    }
}