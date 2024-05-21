package fysiotherapie.security.presentation.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import fysiotherapie.security.application.service.UserService;
import fysiotherapie.security.presentation.dto.request.Registration;

@RestController
@RequestMapping("auth/register")
public class RegistrationController {
    private final UserService userService;

    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/user")
    public void registerUser(@Validated @RequestBody Registration registration) {
        userService.registerUser(
                registration.email,
                registration.password,
                registration.firstName,
                registration.lastName);
    }

    @PostMapping("/admin")
    public void registerAdmin(@Validated @RequestBody Registration registration) {
        userService.registerAdmin(
                registration.email,
                registration.password,
                registration.firstName,
                registration.lastName);
    }
}
