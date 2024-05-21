package fysiotherapie.security.data;

import org.springframework.data.jpa.repository.JpaRepository;
import fysiotherapie.security.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
