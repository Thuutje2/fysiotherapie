package fysiotherapie.physiotherapy.data;

import fysiotherapie.physiotherapy.domain.Joint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JointRepository extends JpaRepository<Joint, Long>{
    Optional<Joint> findJointByType(String type);
}
