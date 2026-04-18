package ua.nure.medirepairtrack.Controller.claim;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO.ClaimHistoryResponseDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO.CreateCommentDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO.CreateWorkLogDTO;
import ua.nure.medirepairtrack.DTO.claim.ClaimHistoryDTO.UpdateWorkLogDTO;
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

    @PostMapping("/work-log")
    public ClaimHistoryResponseDTO addWorkLog(@PathVariable Integer claimId, @RequestBody CreateWorkLogDTO dto) {
        dto.setClaimId(claimId);
        return claimHistoryService.addWorkLog(dto);
    }

    @PutMapping("/work-log/{id}")
    public ClaimHistoryResponseDTO updateWorkLog(@PathVariable Integer claimId, @PathVariable Integer id, @RequestBody UpdateWorkLogDTO dto) {
        return claimHistoryService.updateWorkLog(id, dto);
    }

    @DeleteMapping("/work-log/{id}")
    public void deleteWorkLog(@PathVariable Integer claimId, @PathVariable Integer id, @RequestParam Integer employeeId) {
        claimHistoryService.deleteWorkLog(id, employeeId);
    }

    @PostMapping("/comment")
    public ClaimHistoryResponseDTO addComment(@PathVariable Integer claimId, @RequestBody CreateCommentDTO dto) {
        dto.setClaimId(claimId);
        return claimHistoryService.addComment(dto);
    }
}