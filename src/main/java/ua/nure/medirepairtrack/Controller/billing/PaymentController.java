package ua.nure.medirepairtrack.Controller.billing;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.billing.PaymentDTO.CreatePaymentDTO;
import ua.nure.medirepairtrack.DTO.billing.PaymentDTO.PaymentResponseDTO;
import ua.nure.medirepairtrack.DTO.billing.PaymentDTO.PaymentViewDTO;
import ua.nure.medirepairtrack.Service.billing.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Створити оплату (PENDING)
     */
    @PostMapping
    public PaymentResponseDTO create(@Valid @RequestBody CreatePaymentDTO dto) {
        return paymentService.create(dto);
    }

    /**
     * Завершити оплату (COMPLETED)
     * Ініціює оновлення Invoice через InvoiceService
     */
    @PostMapping("/{paymentId}/complete")
    public PaymentResponseDTO complete(@PathVariable Integer paymentId) {
        return paymentService.complete(paymentId);
    }

    /**
     * Отримати всі оплати по рахунку
     */
    @GetMapping("/invoice/{invoiceId}")
    public List<PaymentResponseDTO> getByInvoice(@PathVariable Integer invoiceId) {
        return paymentService.getByInvoice(invoiceId);
    }

    @GetMapping
    public List<PaymentViewDTO> getAll() {
        return paymentService.getAll();
    }

    @GetMapping("/client/{clientId}")
    public List<PaymentViewDTO> getByClient(@PathVariable Integer clientId) {
        return paymentService.getByClient(clientId);
    }

    @GetMapping("/{paymentId}")
    public PaymentViewDTO getById(@PathVariable Integer paymentId) {
        return paymentService.getById(paymentId);
    }
}
