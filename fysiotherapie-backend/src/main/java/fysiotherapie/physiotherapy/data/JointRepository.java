package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Joint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JointRepository extends JpaRepository<Joint, Long> {
}
