package fysiotherapie.setup;

import fysiotherapie.security.application.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Properties;

@Configuration
public class AdminConfig {

    private final UserService userService;
    private static final String PROPERTIES_FILE = "src/main/resources/admin.properties";

    public AdminConfig(UserService userService) {
        this.userService = userService;
    }

    @Bean
    public void saveAdmin() {
        if (userService.existsByUsername("admin@gmail.com")) {
            System.out.println("Admin user already exists in the database. Skipping registration.");
            return;
        }
        Properties properties = new Properties();
        OutputStream output = null;

        try {
            output = new FileOutputStream(PROPERTIES_FILE);

            properties.setProperty("admin.username", "admin@gmail.com");
            properties.setProperty("admin.password", "secret");
            properties.setProperty("admin.firstName", "Ad");
            properties.setProperty("admin.lastName", "Min");

            properties.store(output, null);

            userService.registerAdmin("admin@gmail.com", "secret", "Ad", "Min");
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