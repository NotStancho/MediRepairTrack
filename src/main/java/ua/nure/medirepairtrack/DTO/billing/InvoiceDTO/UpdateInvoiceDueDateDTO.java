package ua.nure.medirepairtrack.DTO.billing.InvoiceDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateInvoiceDueDateDTO {
    @NotNull(message = "Нова дата оплати рахунку обов'язкова")
    private LocalDateTime dueAt;
}

