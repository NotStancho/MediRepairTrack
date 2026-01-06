package ua.nure.medirepairtrack.Entity.ClaimEmployee;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimEmployeeId {
    private Integer claimId;
    private Integer employeeId;
}

