package ua.nure.medirepairtrack.DTO.ClientDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientSearchDTO {

    private Integer id;

    private String organizationName;
    private String organizationEmail;
    private String organizationPhoneNumber;
    private String contactPersonName;
}
