package ua.nure.medirepairtrack.Controller.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO.ClaimHistoryResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO.CreateCommentDTO;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/claims/{claimId}/history")
@RequiredArgsConstructor
public class ClaimHistoryController {

    private final ClaimHistoryService claimHistoryService;

    @GetMapping
    public List<ClaimHistoryResponseDTO> getClaimHistory(@PathVariable Integer claimId) {
        return claimHistoryService.getByClaim(claimId);
    }

    @PostMapping("/comment")
    public ClaimHistoryResponseDTO addComment(@PathVariable Integer claimId, @RequestBody CreateCommentDTO dto) {
        dto.setClaimId(claimId);
        return claimHistoryService.addComment(dto);
    }
}
