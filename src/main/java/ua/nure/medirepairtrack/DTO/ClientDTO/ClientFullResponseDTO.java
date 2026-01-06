package ua.nure.medirepairtrack.DTO.ClientDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientFullResponseDTO {

    private Integer id;

    // USER INFO
    private Integer userId;
    private String userEmail;
    private String userFirstName;
    private String userMiddleName;
    private String userLastName;
    private String userPhone;

    // CLIENT INFO
    private String organizationName;
    private String organizationEmail;
    private String organizationPhoneNumber;
    private String contactPersonName;
    private String address;
    private String notes;
}
