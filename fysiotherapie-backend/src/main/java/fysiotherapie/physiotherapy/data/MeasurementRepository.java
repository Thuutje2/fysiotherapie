package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
    List<Measurement> findAllByTreatmentId(long id);
}
