package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Physiotherapist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PhysiotherapistRepository extends JpaRepository<Physiotherapist, Long> {
    Optional<Physiotherapist> findByEmail(String email);
    @Query("SELECT COUNT(p) > 0 FROM physiotherapists pt JOIN pt.patients p WHERE pt.email = :email AND p.id = :patientId")
    boolean existsByEmailAndPatientId(String email, Long patientId);
}
