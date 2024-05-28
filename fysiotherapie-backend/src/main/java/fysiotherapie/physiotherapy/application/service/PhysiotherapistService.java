package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.application.exception.PatientNotAssignedToPhysiotherapistException;
import fysiotherapie.physiotherapy.application.exception.PhysiotherapistNotFoundException;
import fysiotherapie.physiotherapy.data.PatientRepository;
import fysiotherapie.physiotherapy.data.PhysiotherapistRepository;
import fysiotherapie.physiotherapy.domain.Physiotherapist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PhysiotherapistService {
    private final PhysiotherapistRepository physiotherapistRepository;
    private final PatientRepository patientRepository;

    public PhysiotherapistService(PhysiotherapistRepository physiotherapistRepository, PatientRepository patientRepository) {
        this.physiotherapistRepository = physiotherapistRepository;
        this.patientRepository = patientRepository;
    }

    private Physiotherapist tryFindingPhysiotherapistById(long id) {
        return physiotherapistRepository.findById(id).orElseThrow(() ->
                new PhysiotherapistNotFoundException("Physiotherapist does not exist by given id"));
    }

    private Physiotherapist tryFindingPhysiotherapistByEmail(String email) {
        return physiotherapistRepository.findByEmail(email).orElseThrow(()->
                new PhysiotherapistNotFoundException("Physiotherapist does not exist by given email address"));
    }

    public void checkIfPatientIsAssignedToPhysiotherapist(String physiotherapistUsername, long patientId) {
        if (!physiotherapistRepository.existsByEmailAndPatientId(physiotherapistUsername, patientId)) {
            throw new PatientNotAssignedToPhysiotherapistException("Given patient not assigned to physiotherapist");
        }
    }

    public void savePhysiotherapist(Physiotherapist physiotherapist) {
        physiotherapistRepository.save(physiotherapist);
    }

    public Physiotherapist getPhysiotherapistByEmail(String email) {
        return tryFindingPhysiotherapistByEmail(email);
    }
}
