package ua.nure.medirepairtrack.DTO.InvoiceDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateInvoiceDueDateDTO {
    @NotNull
    private LocalDateTime dueAt;
}

