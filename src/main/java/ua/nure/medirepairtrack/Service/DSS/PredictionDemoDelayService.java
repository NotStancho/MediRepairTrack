package ua.nure.medirepairtrack.Service.DSS;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PredictionDemoDelayService {

    @Value("${dss.prediction.demo-delay.enabled:false}")
    private boolean enabled;

    @Value("${dss.prediction.demo-delay.ms:1000}")
    private long delayMs;

    public void waitIfEnabled() {
        if (!enabled || delayMs <= 0) {
            return;
        }

        try {
            Thread.sleep(delayMs);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("DSS demo delay was interrupted", ex);
        }
    }
}
