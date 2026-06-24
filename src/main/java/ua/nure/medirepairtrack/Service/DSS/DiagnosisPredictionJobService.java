package ua.nure.medirepairtrack.Service.DSS;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionJobDTO.DiagnosisPredictionJobResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionJobDTO.DiagnosisPredictionJobStatus;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class DiagnosisPredictionJobService {

    @Value("${dss.prediction.sse.event-name}")
    private String sseEventName;

    @Value("${dss.prediction.sse.timeout-ms}")
    private Long sseTimeout;

    private final Map<Integer, DiagnosisPredictionJobResponseDTO> jobs = new ConcurrentHashMap<>();
    private final Map<Integer, Set<SseEmitter>> emittersByDiagnosisId = new ConcurrentHashMap<>();

    public Optional<DiagnosisPredictionJobResponseDTO> getCurrentByDiagnosisId(Integer diagnosisId) {
        return Optional.ofNullable(jobs.get(diagnosisId));
    }

    public SseEmitter subscribe(Integer diagnosisId) {
        SseEmitter emitter = new SseEmitter(sseTimeout);

        emittersByDiagnosisId
                .computeIfAbsent(diagnosisId, id -> ConcurrentHashMap.newKeySet())
                .add(emitter);

        Runnable cleanup = () -> removeEmitter(diagnosisId, emitter);

        emitter.onCompletion(cleanup);
        emitter.onTimeout(cleanup);
        emitter.onError(error -> cleanup.run());

        DiagnosisPredictionJobResponseDTO current = jobs.get(diagnosisId);
        if (current != null) {
            sendToEmitter(diagnosisId, emitter, current);
        }

        return emitter;
    }

    public void start(Integer diagnosisId) {
        update(diagnosisId, DiagnosisPredictionJobStatus.PENDING, 0,
                "QUEUED", "Очікуємо запуск автоматичного прогнозу.", null);
    }

    public void running(Integer diagnosisId, int progress, String stage, String message) {
        update(diagnosisId, DiagnosisPredictionJobStatus.RUNNING,
                clampProgress(progress), stage, message, null);
    }

    public void complete(Integer diagnosisId) {
        update(diagnosisId, DiagnosisPredictionJobStatus.COMPLETED, 100,
                "COMPLETED", "Прогноз готовий. Дані діагностики оновлено.", null);
    }

    public void fail(Integer diagnosisId, String errorMessage) {
        DiagnosisPredictionJobResponseDTO current = jobs.get(diagnosisId);

        int progress = current != null && current.getProgress() != null
                ? Math.max(current.getProgress(), 1)
                : 1;

        update(diagnosisId, DiagnosisPredictionJobStatus.FAILED, progress,
                "FAILED",
                "Не вдалося сформувати автоматичний прогноз.",
                errorMessage);
    }

    private void update(Integer diagnosisId, DiagnosisPredictionJobStatus status, int progress,
                        String stage, String message, String errorMessage) {
        DiagnosisPredictionJobResponseDTO current = jobs.get(diagnosisId);

        LocalDateTime startedAt = current != null
                ? current.getStartedAt()
                : LocalDateTime.now();

        DiagnosisPredictionJobResponseDTO dto = DiagnosisPredictionJobResponseDTO.builder()
                .diagnosisId(diagnosisId)
                .status(status)
                .progress(progress)
                .currentStage(stage)
                .message(message)
                .errorMessage(errorMessage)
                .startedAt(startedAt)
                .finishedAt(isTerminal(status) ? LocalDateTime.now() : null)
                .build();

        jobs.put(diagnosisId, dto);

        sendToSubscribers(dto);

        if (isTerminal(status)) {
            jobs.remove(diagnosisId);
        }
    }

    private void sendToSubscribers(DiagnosisPredictionJobResponseDTO dto) {
        Set<SseEmitter> emitters = emittersByDiagnosisId.get(dto.getDiagnosisId());

        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            sendToEmitter(dto.getDiagnosisId(), emitter, dto);
        }
    }

    private void sendToEmitter(Integer diagnosisId, SseEmitter emitter, DiagnosisPredictionJobResponseDTO dto) {
        try {
            emitter.send(SseEmitter.event()
                    .name(sseEventName)
                    .reconnectTime(3000)
                    .data(dto));

            if (isTerminal(dto.getStatus())) {
                removeEmitter(diagnosisId, emitter);
                emitter.complete();
            }
        } catch (IOException | IllegalStateException ex) {
            removeEmitter(diagnosisId, emitter);
            log.debug("SSE client disconnected for diagnosis {}", diagnosisId, ex);
        }
    }

    private void removeEmitter(Integer diagnosisId, SseEmitter emitter) {
        Set<SseEmitter> emitters = emittersByDiagnosisId.get(diagnosisId);

        if (emitters == null) {
            return;
        }

        emitters.remove(emitter);

        if (emitters.isEmpty()) {
            emittersByDiagnosisId.remove(diagnosisId, emitters);
        }
    }

    private boolean isTerminal(DiagnosisPredictionJobStatus status) {
        return status == DiagnosisPredictionJobStatus.COMPLETED
                || status == DiagnosisPredictionJobStatus.FAILED;
    }

    private int clampProgress(int progress) {
        return Math.max(0, Math.min(100, progress));
    }
}
