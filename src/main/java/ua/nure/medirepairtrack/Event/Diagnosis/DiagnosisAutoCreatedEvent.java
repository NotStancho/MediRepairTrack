package ua.nure.medirepairtrack.Event.Diagnosis;

import ua.nure.medirepairtrack.Entity.DSS.Similarity.SimilaritySearchMode;

public record DiagnosisAutoCreatedEvent(Integer diagnosisId, Integer claimId, SimilaritySearchMode similaritySearchMode) {
}
