package fysiotherapie.security.presentation.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import fysiotherapie.security.application.service.UserService;
import fysiotherapie.security.presentation.dto.request.Registration;

@RestController

@RequestMapping("auth/")
public class RegistrationController {
    private final UserService userService;

    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("register/user")
    public void registerUser(@Validated @RequestBody Registration registration) {
        userService.registerUser(
                registration.email,
                registration.password,
                registration.firstName,
                registration.lastName);
    }

    @PostMapping("register/admin")
    public void registerAdmin(@Validated @RequestBody Registration registration) {
        userService.registerAdmin(
                registration.email,
                registration.password,
                registration.firstName,
                registration.lastName);
    }

    @GetMapping("role")
    public String getRoleOfAuthenticatedUser(Authentication authentication) {
        return authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("");
    }
}
