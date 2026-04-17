package ua.nure.medirepairtrack.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.CreateManualDiagnosisDTO;
import ua.nure.medirepairtrack.DTO.DiagnosisDTO.UpdateDiagnosisDTO;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.Diagnosis.DiagnosisStatus;
import ua.nure.medirepairtrack.Entity.Diagnosis.DiagnosisType;
import ua.nure.medirepairtrack.Entity.Employee.Employee;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Repository.DiagnosisRepository;
import ua.nure.medirepairtrack.Workflow.DiagnosisStatusMachine;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DiagnosisServiceTest {

    private DiagnosisRepository diagnosisRepository;
    private ClaimService claimService;
    private EmployeeService employeeService;
    private DiagnosisPredictionRepository diagnosisPredictionRepository;
    private DiagnosisStatusMachine statusMachine;

    private DiagnosisService diagnosisService;

    @BeforeEach
    void setUp() {
        diagnosisRepository = mock(DiagnosisRepository.class);
        claimService = mock(ClaimService.class);
        employeeService = mock(EmployeeService.class);
        diagnosisPredictionRepository = mock(DiagnosisPredictionRepository.class);
        statusMachine = mock(DiagnosisStatusMachine.class);

        when(diagnosisPredictionRepository.existsByDiagnosisId(any()))
                .thenReturn(false);

        diagnosisService = new DiagnosisService(
                diagnosisRepository,
                claimService,
                employeeService,
                diagnosisPredictionRepository,
                null, // eventPublisher не потрібен
                statusMachine
        );
    }

    // 1. CREATE
    @Test
    void createManualDiagnosis_shouldCreateDiagnosis() {
        CreateManualDiagnosisDTO dto = new CreateManualDiagnosisDTO();
        dto.setClaimId(1);
        dto.setEngineerId(2);
        dto.setPreliminaryConclusion("Test");
        dto.setEstimatedCost(BigDecimal.TEN);
        dto.setEstimatedTimeHours(BigDecimal.ONE);

        when(claimService.getClaim(1)).thenReturn(new Claim());
        when(employeeService.getEmployeeEntity(2)).thenReturn(new Employee());

        when(diagnosisRepository.save(any(Diagnosis.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var result = diagnosisService.createManualDiagnosis(dto);

        assertNotNull(result);
        assertEquals(DiagnosisType.MANUAL, result.getDiagnosisType());
        assertEquals(DiagnosisStatus.DRAFT, result.getStatus());
    }

    // 2. UPDATE
    @Test
    void updateDiagnosis_shouldUpdateFields() {
        Claim claim = new Claim();
        claim.setId(100);

        Diagnosis diagnosis = Diagnosis.builder()
                .id(1)
                .claim(claim)
                .diagnosisType(DiagnosisType.AUTOMATED)
                .status(DiagnosisStatus.PREDICTED)
                .estimatedCost(BigDecimal.ONE)
                .estimatedTimeHours(BigDecimal.ONE)
                .build();

        when(diagnosisRepository.findById(1)).thenReturn(Optional.of(diagnosis));
        when(statusMachine.allowsDiagnosisEdit(any())).thenReturn(true);

        when(diagnosisRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UpdateDiagnosisDTO dto = new UpdateDiagnosisDTO();
        dto.setPreliminaryConclusion("Updated");

        var result = diagnosisService.updateDiagnosis(1, dto);

        assertEquals(DiagnosisType.HYBRID, result.getDiagnosisType());
    }

    // 3. CONFIRM (ГОЛОВНИЙ)
    @Test
    void confirmDiagnosis_shouldConfirmDiagnosis() {
        Claim claim = new Claim();
        claim.setId(100);

        Diagnosis diagnosis = Diagnosis.builder()
                .id(1)
                .claim(claim)
                .status(DiagnosisStatus.DRAFT)
                .finalConclusion("OK")
                .estimatedCost(BigDecimal.TEN)
                .estimatedTimeHours(BigDecimal.ONE)
                .build();

        when(diagnosisRepository.findById(1)).thenReturn(Optional.of(diagnosis));
        when(employeeService.getEmployeeEntity(1)).thenReturn(new Employee());
        when(statusMachine.allowsDiagnosisConfirm(any())).thenReturn(true);

        when(diagnosisRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var result = diagnosisService.confirmDiagnosis(1, 1);

        assertEquals(DiagnosisStatus.CONFIRMED, result.getStatus());
        assertNotNull(result.getConfirmedAt());
    }

    // 4. Негативний кейс
    @Test
    void confirmDiagnosis_shouldThrowWhenFinalConclusionIsBlank() {
        Claim claim = new Claim();
        claim.setId(100);

        Diagnosis diagnosis = Diagnosis.builder()
                .id(1)
                .claim(claim)
                .status(DiagnosisStatus.DRAFT)
                .finalConclusion("")
                .estimatedCost(BigDecimal.TEN)
                .estimatedTimeHours(BigDecimal.ONE)
                .build();

        when(diagnosisRepository.findById(1)).thenReturn(Optional.of(diagnosis));
        when(employeeService.getEmployeeEntity(1)).thenReturn(new Employee());
        when(statusMachine.allowsDiagnosisConfirm(any())).thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> diagnosisService.confirmDiagnosis(1, 1));
    }
}