package ua.nure.medirepairtrack.Service.DSS;

import org.junit.jupiter.api.Test;
import ua.nure.medirepairtrack.Client.GeminiText.GeminiTextClient;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.PredictedDefectContext;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.PredictedWorkPartContext;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.PredictedWorkContext;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.PredictionContext;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.SimilarCaseContext;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PredictionExplanationServiceTest {

    @Test
    void generateExplanation_shouldUseFallbackTemplateWhenGeminiFails() {

        GeminiTextClient geminiTextClient = mock(GeminiTextClient.class);

        when(geminiTextClient.generate(anyString()))
                .thenThrow(new RuntimeException("Gemini is overloaded"));

        PredictionExplanationService service = new PredictionExplanationService(
                null,
                null,
                null,
                null,
                geminiTextClient
        );

        PredictionContext context = PredictionContext.builder()
                .equipmentModel("Infusion Pump X100")
                .claimDescription("Не запускається після заряджання")
                .similarCases(List.of(
                        SimilarCaseContext.builder()
                                .defectDescription("Не вмикається після підключення зарядного пристрою")
                                .similarityScore(BigDecimal.valueOf(0.86))
                                .build()
                ))
                .predictedDefects(List.of(
                        PredictedDefectContext.builder()
                                .name("Проблема живлення")
                                .probability(BigDecimal.valueOf(0.72))
                                .build()
                ))
                .predictedWorks(List.of(
                        PredictedWorkContext.builder()
                                .repairWorkId(10)
                                .repairWorkName("Діагностика блоку живлення")
                                .probability(BigDecimal.valueOf(0.64))
                                .estimatedTime(BigDecimal.valueOf(1.5))
                                .predictedParts(List.of(
                                        PredictedWorkPartContext.builder()
                                                .repairWorkId(10)
                                                .partName("Акумулятор")
                                                .probability(BigDecimal.valueOf(0.58))
                                                .predictedQuantity(BigDecimal.ONE)
                                                .unitName("шт")
                                                .build()
                                ))
                                .build()
                ))
                .predictedTimeHours(BigDecimal.valueOf(1.5))
                .predictedCost(BigDecimal.valueOf(1200))
                .warrantyProbability(BigDecimal.valueOf(0.25))
                .confidenceScore(BigDecimal.valueOf(0.86))
                .build();

        String explanation = service.generateExplanation(context);

        assertTrue(explanation.contains("сформовано за шаблоном"));
        assertTrue(explanation.contains("LLM-сервіс тимчасово недоступний"));
        assertTrue(explanation.contains("Infusion Pump X100"));
        assertTrue(explanation.contains("Проблема живлення"));
        assertTrue(explanation.contains("Акумулятор"));
        assertTrue(explanation.contains("86%"));
    }
}
