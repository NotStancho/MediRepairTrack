package ua.nure.medirepairtrack.Client.GeminiText;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
public class GeminiTextRequest {

    private final List<Content> contents;

    public GeminiTextRequest(String prompt) {
        this.contents = List.of(
                new Content(
                        List.of(new Part(prompt))
                )
        );
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
