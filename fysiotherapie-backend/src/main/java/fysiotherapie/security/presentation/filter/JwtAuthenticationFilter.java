package fysiotherapie.security.presentation.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import fysiotherapie.security.domain.User;
import fysiotherapie.security.presentation.dto.request.Login;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    private final String secret;
    private final Integer expirationInMs;
    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationFilter(
            String path,
            String secret,
            Integer expirationInMs,
            AuthenticationManager authenticationManager
    ) {
        super(new AntPathRequestMatcher(path));

        this.secret = secret;
        this.expirationInMs = expirationInMs;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException, IOException {
        Login login = new ObjectMapper()
                .readValue(request.getInputStream(), Login.class);

        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.email, login.password)
        );
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain filterChain, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        List<String> roles = user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        byte[] signingKey = this.secret.getBytes();

        String token = Jwts.builder()
                .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS512)
                .setHeaderParam("type", "JWT")
                .setIssuer("fysiotherapie-api")
                .setAudience("fysiotherapie")
                .setSubject(user.getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + this.expirationInMs))
                .claim("role", roles)
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .compact();

//        Cookie cookie = new Cookie("JWT", token);
//        cookie.setHttpOnly(true);
//        cookie.setMaxAge(3600);
//        cookie.setSecure(false);
//        cookie.setPath("/");
//        cookie.setDomain(null);
//        response.addCookie(cookie);
//        response.addHeader("Set-Cookie", "JWT=" + token + "; Max-Age=3600; HttpOnly; Path=/; Domain=localhost");
//        response.addHeader("Access-Control-Allow-Credentials", "true");
////        response.addHeader("Access-Control-Allow-Origin", "http://localhost:5173");
//        response.addHeader("Access-Control-Allow-Headers", "*");
//        response.addHeader("Access-Control-Allow-Methods", "*");
//        response.addHeader("Access-Control-Allow-Headers", "Content-Type");

        response.addHeader("Authorization", "Bearer " + token);

    }
}
