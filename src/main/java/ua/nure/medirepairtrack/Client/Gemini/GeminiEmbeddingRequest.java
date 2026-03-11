package ua.nure.medirepairtrack.Client.Gemini;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
public class GeminiEmbeddingRequest {

    private final Content content;

    public GeminiEmbeddingRequest(String text) {
        this.content = new Content(List.of(new Part(text)));
    }

    @Getter
    @AllArgsConstructor
    static class Content {
        private final List<Part> parts;
    }

    @Getter
    @AllArgsConstructor
    static class Part {
        private final String text;
    }
}
