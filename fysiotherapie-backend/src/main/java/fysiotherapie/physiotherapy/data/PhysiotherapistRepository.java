package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Physiotherapist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PhysiotherapistRepository extends JpaRepository<Physiotherapist, Long>  {
    Optional<Physiotherapist> findByEmail(String email);
}
