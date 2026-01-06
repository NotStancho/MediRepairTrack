package ua.nure.medirepairtrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MediRepairTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediRepairTrackApplication.class, args);
    }

}
