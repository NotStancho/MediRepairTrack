package ua.nure.medirepairtrack.Client.GeminiEmbedded;

import lombok.Getter;
import java.util.List;

@Getter
public class GeminiEmbeddingResponse {

    private Embedding embedding;

    @Getter
    public static class Embedding {
        private List<Double> values;
    }

    public List<Double> getEmbeddingValues() {

        if (embedding == null || embedding.getValues() == null) {
            throw new IllegalStateException("Gemini returned empty embedding");
        }

        return embedding.getValues();
    }
}
