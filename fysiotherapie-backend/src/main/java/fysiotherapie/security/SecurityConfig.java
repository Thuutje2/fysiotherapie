package fysiotherapie.security;

import fysiotherapie.security.domain.Role;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import fysiotherapie.security.presentation.filter.JwtAuthenticationFilter;
import fysiotherapie.security.presentation.filter.JwtAuthorizationFilter;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {
    private static final String LOGIN_PATH = "/auth/login";
    private static final String LOGOUT_PATH = "/auth/logout";
    private static final String REGISTER_USER_PATH = "/auth/register/user";
    private static final String REGISTER_ADMIN_PATH = "/auth/register/admin";
    private static final String ROLE_PATH = "/auth/role";
    private static final String PATIENTS_PATH = "/patients";
    private static final String PATIENT_INFO_PATH = "/patients/details";
    private static final String TREATMENTS_PATH = "/patients/{patientId}/treatments";
    private static final String PATIENTS_MEASUREMENTS_PATH = "treatments/{treatmentId}/measurements/{measurementId}/joints/{jointType}";
    private static final String PHYSIO_MEASUREMENTS_PATH = "patients/{patientId}/treatments/{treatmentId}/measurements/{measurementId}/joints/{jointType}";

    @Value("${security.jwt.expiration-in-ms}")
    private Integer jwtExpirationInMs;
    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Bean
    protected AuthenticationManager authenticationManager(
            final PasswordEncoder passwordEncoder, final UserDetailsService userDetailsService) {
        final DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(provider);
    }

    @Bean
    protected SecurityFilterChain filterChain(
            final HttpSecurity http, final AuthenticationManager authenticationManager) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(r -> r
                        .requestMatchers(antMatcher(POST, LOGIN_PATH)).permitAll()
                        .requestMatchers(antMatcher(POST, LOGOUT_PATH)).permitAll()
                        .requestMatchers(antMatcher(POST, REGISTER_USER_PATH)).hasAuthority(Role.ROLE_ADMIN.toString())
                        .requestMatchers(antMatcher(POST, REGISTER_ADMIN_PATH)).hasAuthority(Role.ROLE_ADMIN.toString())
                        .requestMatchers(antMatcher(GET, ROLE_PATH)).authenticated()

                        .requestMatchers(antMatcher(POST, PATIENTS_PATH)).hasAuthority(Role.ROLE_ADMIN.toString())
                        .requestMatchers(antMatcher(GET, PATIENTS_PATH)).hasAuthority(Role.ROLE_ADMIN.toString())
                        .requestMatchers(antMatcher(GET, PATIENT_INFO_PATH)).authenticated()
                        .requestMatchers(antMatcher(GET, TREATMENTS_PATH)).authenticated()
                        .requestMatchers(antMatcher(POST, TREATMENTS_PATH)).authenticated()
                        .requestMatchers(antMatcher(DELETE, TREATMENTS_PATH)).authenticated()
                        .requestMatchers(antMatcher(GET, PATIENTS_MEASUREMENTS_PATH)).authenticated()
                        .requestMatchers(antMatcher(GET, PHYSIO_MEASUREMENTS_PATH)).hasAuthority(Role.ROLE_ADMIN.toString())
                        .requestMatchers(antMatcher(POST, PHYSIO_MEASUREMENTS_PATH)).hasAuthority(Role.ROLE_ADMIN.toString())
                        .requestMatchers(antMatcher("/error")).anonymous()
                        .anyRequest().authenticated()
                )
                .logout(logout -> logout
                        .logoutUrl(LOGOUT_PATH)
                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(HttpServletResponse.SC_OK))
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                )
                .addFilterBefore(new JwtAuthenticationFilter(
                        LOGIN_PATH,
                        jwtSecret,
                        jwtExpirationInMs,
                        authenticationManager
                ), UsernamePasswordAuthenticationFilter.class)
                .addFilter(new JwtAuthorizationFilter(jwtSecret, authenticationManager))
                .sessionManagement(s -> s.sessionCreationPolicy(STATELESS));
        return http.build();
    }

    @Bean
    protected PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
