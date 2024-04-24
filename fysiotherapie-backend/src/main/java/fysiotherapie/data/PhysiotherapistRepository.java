package fysiotherapie.data;

import fysiotherapie.domain.Physiotherapist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhysiotherapistRepository extends JpaRepository<Physiotherapist, Long>  {
}
