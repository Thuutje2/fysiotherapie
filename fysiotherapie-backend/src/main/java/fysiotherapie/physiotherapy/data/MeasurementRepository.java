package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
}
