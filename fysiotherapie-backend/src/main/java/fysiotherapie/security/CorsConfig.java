//package fysiotherapie.security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CorsConfig {
//
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/auth/login")
//                        .allowedOrigins("http://localhost:5173")
//                        .allowedMethods(HttpMethod.OPTIONS.name(), HttpMethod.GET.name(), HttpMethod.POST.name(),
//                                HttpMethod.PUT.name(), HttpMethod.PATCH.name(), HttpMethod.DELETE.name())
//                        .allowedHeaders(HttpHeaders.AUTHORIZATION, HttpHeaders.SET_COOKIE)
//                        .allowCredentials(true);
//            }
//        };
//    }
//}