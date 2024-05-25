package fysiotherapie.security.presentation.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import fysiotherapie.security.domain.UserProfile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {
    private final String secret;

    public JwtAuthorizationFilter(
            String secret,
            AuthenticationManager authenticationManager
    ) {
        super(authenticationManager);

        this.secret = secret;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws IOException, ServletException {
        Authentication authentication = this.getAuthentication(request);
        if (authentication != null) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private Authentication getAuthentication(HttpServletRequest request) {
        String token = request.getHeader("Authorization");

//        Cookie[] cookies = request.getCookies();
//        if (cookies == null) {
//            return null;
//        }
//
//       String token = Arrays.stream(cookies)
//               .filter(cookie -> cookie.getName().equals("JWT"))
//               .findFirst()
//               .map(Cookie::getValue).orElse(null);

        if (token == null || token.isEmpty()) {
            return null;
        }

        if (!token.startsWith("Bearer ")) {
            return null;
        }

        byte[] signingKey = this.secret.getBytes();

        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build();

        Jws<Claims> parsedToken = jwtParser
                .parseClaimsJws(token
                        .replace("Bearer ", "")
                );

        var username = parsedToken
                .getBody()
                .getSubject();

        var authorities = ((List<?>) parsedToken.getBody()
                .get("role")).stream()
                .map(authority -> new SimpleGrantedAuthority((String) authority))
                .toList();

        if (username.isEmpty()) {
            return null;
        }

        UserProfile principal = new UserProfile(
                username,
                (String) parsedToken.getBody().get("firstName"),
                (String) parsedToken.getBody().get("lastName")
        );

        return new UsernamePasswordAuthenticationToken(principal, null, authorities);
    }
}
