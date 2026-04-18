package ua.nure.medirepairtrack.Service.billing;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.billing.PaymentDTO.CreatePaymentDTO;
import ua.nure.medirepairtrack.DTO.billing.PaymentDTO.PaymentResponseDTO;
import ua.nure.medirepairtrack.Entity.billing.Invoice.Invoice;
import ua.nure.medirepairtrack.Entity.billing.Payment.Payment;
import ua.nure.medirepairtrack.Entity.billing.Payment.PaymentMethod;
import ua.nure.medirepairtrack.Entity.billing.Payment.PaymentStatus;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.billing.PaymentRepository;
import ua.nure.medirepairtrack.Workflow.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceService invoiceService;

    private final PaymentStatusMachine paymentStatusMachine;
    private final InvoiceStatusMachine invoiceStatusMachine;

    @Transactional
    public PaymentResponseDTO create(CreatePaymentDTO dto) {

        Invoice invoice = invoiceService.getInvoice(dto.getInvoiceId());

        if (!invoiceStatusMachine.allowsPayment(invoice.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied("здійснити оплату", invoice.getStatus(), invoiceStatusMachine.allowedPaymentStatuses())
            );
        }

        if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Сума оплати має бути більшою за 0");
        }

        if (dto.getMethod() != PaymentMethod.CASH) {

            if (dto.getExternalRef() == null || dto.getExternalRef().isBlank()) {
                throw new BadRequestException("Для безготівкової оплати необхідно вказати reference платежу");
            }

            if (dto.getProvider() == null || dto.getProvider().isBlank()) {
                throw new BadRequestException("Для безготівкової оплати необхідно вказати провайдера");
            }
        }

        Payment payment = Payment.builder()
                .invoice(invoice)
                .amount(dto.getAmount())
                .method(dto.getMethod())
                .provider(dto.getProvider())
                .externalRef(dto.getExternalRef())
                .status(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return map(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponseDTO complete(Integer paymentId) {

        Payment payment = getPayment(paymentId);

        if (!paymentStatusMachine.canTransition(payment.getStatus(), PaymentStatus.COMPLETED)) {
            throw new InvalidStatusTransitionException(
                    StatusMessageUtil.invalidTransition(
                            "оплати",
                            payment.getStatus(),
                            PaymentStatus.COMPLETED
                    )
            );
        }

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaidAt(LocalDateTime.now());

        invoiceService.applyPayment(payment.getInvoice().getId(), payment.getAmount());

        return map(paymentRepository.save(payment));
    }

    public List<PaymentResponseDTO> getByInvoice(Integer invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId)
                .stream()
                .map(this::map)
                .toList();
    }

    private Payment getPayment(Integer id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Оплата не знайдена"));
    }

    private PaymentResponseDTO map(Payment p) {
        return PaymentResponseDTO.builder()
                .id(p.getId())
                .invoiceId(p.getInvoice().getId())
                .amount(p.getAmount())
                .method(p.getMethod())
                .status(p.getStatus())
                .provider(p.getProvider())
                .externalRef(p.getExternalRef())
                .paidAt(p.getPaidAt())
                .createdAt(p.getCreatedAt())
                .build();
    }
}

