package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreatmentRepository extends JpaRepository<Treatment, Long> {
}
