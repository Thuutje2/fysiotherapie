package fysiotherapie.setup;

import fysiotherapie.security.application.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Properties;

@Configuration
public class PatientConfig {
    private final UserService userService;
    private static final String PROPERTIES_FILE = "src/main/resources/patient.properties";

    public PatientConfig(UserService userService) {
        this.userService = userService;
    }

    @Bean
    public void savePatient() {
        if (userService.existsByUsername("patient@gmail.com")) {
            System.out.println("Patient user already exists in the database. Skipping registration.");
            return;
        }
        Properties properties = new Properties();
        OutputStream output = null;

        try {
            output = new FileOutputStream(PROPERTIES_FILE);

            properties.setProperty("patient.username", "patient@gmail.com");
            properties.setProperty("patient.password", "secret");
            properties.setProperty("patient.firstName", "Pat");
            properties.setProperty("patient.lastName", "Ient");

            properties.store(output, null);

            userService.registerUser("patient@gmail.com", "secret", "Pat", "Ient");
        } catch (IOException io) {
            io.printStackTrace();
        } finally {
            if (output != null) {
                try {
                    output.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
