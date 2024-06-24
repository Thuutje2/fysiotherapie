package fysiotherapie.security.application.service;

import fysiotherapie.physiotherapy.application.service.PhysiotherapistService;
import fysiotherapie.physiotherapy.domain.Physiotherapist;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import fysiotherapie.security.application.exception.UsernameNotUniqueException;
import fysiotherapie.security.data.UserRepository;
import fysiotherapie.security.domain.Role;
import fysiotherapie.security.domain.User;

@Service
@Transactional
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PhysiotherapistService physiotherapistService;

    public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder,
                       PhysiotherapistService physiotherapistService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.physiotherapistService = physiotherapistService;
    }

    private void register(String username, String password, String firstName, String lastName, Role role) {
        String encodedPassword = this.passwordEncoder.encode(password);

        if (existsByUsername(username)) {
            throw new UsernameNotUniqueException("Username already exists, choose another one");
        }

        User user = new User(username, encodedPassword, firstName, lastName, role);
        this.userRepository.save(user);
    }

    public void registerUser(String username, String password, String firstName, String lastName) {
        register(username, password, firstName, lastName, Role.ROLE_USER);
    }

    public void registerAdmin(String username, String password, String firstName, String lastName) {
        register(username, password, firstName, lastName, Role.ROLE_ADMIN);
        physiotherapistService.savePhysiotherapist(new Physiotherapist(firstName, lastName, username));
    }

    public User loadUserByUsername(String username) {
        return this.userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

    public Boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}
