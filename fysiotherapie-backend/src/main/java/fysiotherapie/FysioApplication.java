package fysiotherapie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class FysioApplication {
    public static void main(String[] args) {
        SpringApplication.run(FysioApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/auth/login").allowedOrigins("http://localhost:5173");
                registry.addMapping("/auth/role").allowedOrigins("http://localhost:5173");
            }
        };
    }
}
