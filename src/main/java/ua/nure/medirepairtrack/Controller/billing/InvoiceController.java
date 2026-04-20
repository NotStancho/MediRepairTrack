package ua.nure.medirepairtrack.Controller.billing;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.billing.InvoiceDTO.*;
import ua.nure.medirepairtrack.Entity.billing.Invoice.InvoiceStatus;
import ua.nure.medirepairtrack.Service.billing.InvoiceService;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/claim/{claimId}")
    public InvoiceResponseDTO createDraft(@PathVariable Integer claimId) {
        return invoiceService.createDraft(claimId);
    }

    @PostMapping("/{invoiceId}/recalculate")
    public InvoiceResponseDTO recalculate(@PathVariable Integer invoiceId) {
        return invoiceService.recalculate(invoiceId);
    }


    @PostMapping("/{invoiceId}/items/other")
    public InvoiceDetailResponseDTO addOtherItem(@PathVariable Integer invoiceId, @Valid @RequestBody CreateInvoiceOtherItemDTO dto) {
        return invoiceService.addOtherItem(invoiceId, dto);
    }
    @PatchMapping("/{invoiceId}/items/other/{itemId}")
    public InvoiceDetailResponseDTO updateOtherItem(@PathVariable Integer invoiceId, @PathVariable Integer itemId, @RequestBody @Valid UpdateInvoiceOtherItemDTO dto) {
        return invoiceService.updateOtherItem(invoiceId, itemId, dto);
    }
    @DeleteMapping("/{invoiceId}/items/other/{itemId}")
    public void deleteOtherItem(@PathVariable Integer invoiceId, @PathVariable Integer itemId) {
        invoiceService.deleteOtherItem(invoiceId, itemId);
    }


    @PostMapping("/{invoiceId}/issue")
    public InvoiceResponseDTO issue(@PathVariable Integer invoiceId) {
        return invoiceService.issue(invoiceId);
    }

    @PostMapping("/{id}/cancel")
    public void cancel(@PathVariable Integer id) {
        invoiceService.cancel(id);
    }

    @PatchMapping("/{id}/due-date")
    public InvoiceResponseDTO updateDueDate(@PathVariable Integer id, @Valid @RequestBody UpdateInvoiceDueDateDTO dto) {
        return invoiceService.updateDueDate(id, dto.getDueAt());
    }

    @GetMapping
    public List<InvoiceResponseDTO> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/client/{clientId}")
    public List<InvoiceResponseDTO> getByClientId(@PathVariable Integer clientId) {
        return invoiceService.getByClientId(clientId);
    }

    @GetMapping("/{invoiceId}")
    public InvoiceResponseDTO getByInvoiceId(@PathVariable Integer invoiceId) {
        return invoiceService.getByInvoiceId(invoiceId);
    }

    @GetMapping("/{invoiceId}/full")
    public InvoiceFullResponseDTO getFullByInvoiceId(@PathVariable Integer invoiceId) {
        return invoiceService.getFullByInvoiceId(invoiceId);
    }


    @GetMapping("/claim/{claimId}")
    public InvoiceResponseDTO getByClaim(@PathVariable Integer claimId) {
        return invoiceService.getByClaimId(claimId);
    }
    @GetMapping("/claim/{claimId}/full")
    public InvoiceFullResponseDTO getFullByClaim(@PathVariable Integer claimId) {
        return invoiceService.getFullByClaimId(claimId);
    }


    @GetMapping("/overdue")
    public List<InvoiceResponseDTO> getOverdueInvoices() {
        return invoiceService.getOverdueInvoices();
    }

    @GetMapping("/{invoiceId}/allowed-statuses")
    public List<InvoiceStatus> allowedStatuses(@PathVariable Integer invoiceId) {
        return invoiceService.getAllowedStatuses(invoiceId);
    }
}

