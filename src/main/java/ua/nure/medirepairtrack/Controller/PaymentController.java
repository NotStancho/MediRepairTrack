package ua.nure.medirepairtrack.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.PaymentDTO.CreatePaymentDTO;
import ua.nure.medirepairtrack.DTO.PaymentDTO.PaymentResponseDTO;
import ua.nure.medirepairtrack.DTO.PaymentDTO.*;
import ua.nure.medirepairtrack.Service.PaymentService;

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
}
