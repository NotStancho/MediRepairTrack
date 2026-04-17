package ua.nure.medirepairtrack.Client.GeminiText;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import ua.nure.medirepairtrack.Exception.ExternalServiceException;

import java.time.Duration;

@Slf4j
@Component
public class GeminiTextClient {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiTextClient(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
    }

    public String generate(String prompt) {

        try {

            GeminiTextRequest request = new GeminiTextRequest(prompt);

            GeminiTextResponse response =
                    webClient.post()
                            .uri(uriBuilder ->
                                    uriBuilder
                                            .path("/models/gemini-2.5-flash:generateContent")
                                            .queryParam("key", apiKey)
                                            .build()
                            )
                            .bodyValue(request)
                            .retrieve()
                            .onStatus(
                                    status -> status.isError(),
                                    clientResponse -> clientResponse
                                            .bodyToMono(String.class)
                                            .map(body -> new ExternalServiceException(
                                                    "Gemini API error: " + clientResponse.statusCode() + " " + body
                                            ))
                            )
                            .bodyToMono(GeminiTextResponse.class)
                            .block(Duration.ofSeconds(120));

            if (response == null) {
                throw new ExternalServiceException("Gemini API returned null response");
            }

            return response.getText();

        } catch (Exception ex) {
            log.error("Gemini text generation failed", ex);
            throw new ExternalServiceException("Failed to generate text via Gemini API", ex);
        }
    }
}