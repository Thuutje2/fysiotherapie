package fysiotherapie.application;

import fysiotherapie.application.exception.PhysiotherapistNotFoundException;
import fysiotherapie.data.PhysiotherapistRepository;
import fysiotherapie.domain.Physiotherapist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PhysiotherapistService {
    private final PhysiotherapistRepository physiotherapistRepository;

    public PhysiotherapistService(PhysiotherapistRepository physiotherapistRepository) {
        this.physiotherapistRepository = physiotherapistRepository;
    }

    private Physiotherapist tryFindingPhysiotherapistById(long id) {
        return physiotherapistRepository.findById(id).orElseThrow(()->
                new PhysiotherapistNotFoundException("Physiotherapist does not exist by given id"));
    }

    public Physiotherapist getPhysiotherapist(long id) {
        return tryFindingPhysiotherapistById(id);
    }
}
