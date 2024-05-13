package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
