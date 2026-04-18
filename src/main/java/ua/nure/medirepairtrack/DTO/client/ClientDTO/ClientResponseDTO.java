package ua.nure.medirepairtrack.DTO.client.ClientDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientResponseDTO {

    private Integer id;
    private Integer userId;

    private String organizationName;
    private String organizationEmail;
    private String organizationPhoneNumber;

    private String contactPersonName;
    private String address;
    private String notes;
}
