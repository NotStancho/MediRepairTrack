package ua.nure.medirepairtrack.Entity.Client;

import jakarta.persistence.*;
import lombok.*;
import ua.nure.medirepairtrack.Entity.User.User;

@Entity
@Table(name = "client")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "fk_user", referencedColumnName = "id_user")
    private User user;  // може бути null

    @Column(name = "organization_name", nullable = false, columnDefinition = "TEXT")
    private String organizationName;

    @Column(name = "organization_email", nullable = false, length = 45)
    private String organizationEmail;

    @Column(name = "organization_phone_number", nullable = false, length = 20)
    private String organizationPhoneNumber;

    @Column(name = "contact_person_name", length = 100)
    private String contactPersonName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
