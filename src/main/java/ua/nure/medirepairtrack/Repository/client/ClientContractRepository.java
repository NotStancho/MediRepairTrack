package ua.nure.medirepairtrack.Repository.client;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.client.ClientContract.ClientContract;
import ua.nure.medirepairtrack.Entity.client.ClientContract.ContractStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ClientContractRepository extends JpaRepository<ClientContract, Integer> {

    List<ClientContract> findByClientId(Integer clientId);

    Optional<ClientContract> findFirstByClientIdAndIsActiveAndValidFromLessThanEqualAndValidToGreaterThanEqual(
            Integer clientId,
            ContractStatus status,
            LocalDate from,
            LocalDate to
    );
}

