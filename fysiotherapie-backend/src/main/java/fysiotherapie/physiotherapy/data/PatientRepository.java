package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByEmail(String email);
    @Query("SELECT COUNT(t) > 0 FROM patients p JOIN p.treatments t WHERE p.id = :patientId AND t.id = :treatmentId")
    boolean existsByIdAndTreatmentId(Long patientId, Long treatmentId);
}
