package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.application.exception.PhysiotherapistNotFoundException;
import fysiotherapie.physiotherapy.data.PhysiotherapistRepository;
import fysiotherapie.physiotherapy.domain.Physiotherapist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PhysiotherapistService {
    private final PhysiotherapistRepository physiotherapistRepository;

    public PhysiotherapistService(PhysiotherapistRepository physiotherapistRepository) {
        this.physiotherapistRepository = physiotherapistRepository;
    }

    private Physiotherapist tryFindingPhysiotherapistByEmail(String email) {
        return physiotherapistRepository.findByEmail(email).orElseThrow(()->
                new PhysiotherapistNotFoundException("Physiotherapist does not exist by given email address"));
    }

    public void savePhysiotherapist(Physiotherapist physiotherapist) {
        physiotherapistRepository.save(physiotherapist);
    }

    public Physiotherapist getPhysiotherapistByEmail(String email) {
        return tryFindingPhysiotherapistByEmail(email);
    }
}
