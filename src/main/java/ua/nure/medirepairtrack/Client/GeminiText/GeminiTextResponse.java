package ua.nure.medirepairtrack.Client.GeminiText;

import lombok.Getter;

import java.util.List;

@Getter
public class GeminiTextResponse {

    private List<Candidate> candidates;

    @Getter
    public static class Candidate {
        private Content content;
    }

    @Getter
    public static class Content {
        private List<Part> parts;
    }

    @Getter
    public static class Part {
        private String text;
    }

    public String getText() {

        if (candidates == null || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini returned no candidates");
        }

        var parts = candidates.get(0).getContent().getParts();

        if (parts == null || parts.isEmpty()) {
            throw new IllegalStateException("Gemini returned empty text");
        }

        return parts.get(0).getText();
    }
}
