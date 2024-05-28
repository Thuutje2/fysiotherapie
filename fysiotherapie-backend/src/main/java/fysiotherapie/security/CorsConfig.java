package fysiotherapie.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/auth/login").allowedOrigins("http://localhost:5173");
                registry.addMapping("/auth/logout").allowedOrigins("http://localhost:5173");
                registry.addMapping("/auth/role").allowedOrigins("http://localhost:5173");
            }
        };
    }
}