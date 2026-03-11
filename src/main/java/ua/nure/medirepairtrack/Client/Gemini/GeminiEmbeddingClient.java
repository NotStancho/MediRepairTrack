package ua.nure.medirepairtrack.Client.Gemini;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import ua.nure.medirepairtrack.Exception.ExternalServiceException;

import java.time.Duration;
import java.util.List;

@Slf4j
@Component
public class GeminiEmbeddingClient {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiEmbeddingClient(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
    }

    public List<Double> embed(String text) {

        try {

            GeminiEmbeddingRequest request = new GeminiEmbeddingRequest(text);

            GeminiEmbeddingResponse response =
                    webClient.post()
                            .uri(uriBuilder ->
                                    uriBuilder
                                            .path("/models/gemini-embedding-001:embedContent")
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
                            .bodyToMono(GeminiEmbeddingResponse.class)
                            .block(Duration.ofSeconds(10));

            if (response == null) {
                throw new ExternalServiceException("Gemini API returned null response");
            }

            return response.getEmbeddingValues();

        } catch (Exception ex) {
            log.error("Gemini embedding failed", ex);
            throw new ExternalServiceException("Failed to generate embedding via Gemini API", ex);
        }
    }
}
