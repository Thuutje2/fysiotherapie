package fysiotherapie.application;

import fysiotherapie.application.exception.PatientNotFoundException;
import fysiotherapie.data.PatientRepository;
import fysiotherapie.domain.Patient;
import fysiotherapie.domain.Physiotherapist;
import fysiotherapie.presentation.dto.response.PatientInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class PatientService {
    private final PatientRepository patientRepository;
    private final PhysiotherapistService physiotherapistService;

    public PatientService(PatientRepository patientRepository, PhysiotherapistService physiotherapistService) {
        this.patientRepository = patientRepository;
        this.physiotherapistService = physiotherapistService;
    }

    private Patient tryFindingPatientById(long id) {
        return patientRepository.findById(id).orElseThrow(()->
                new PatientNotFoundException("Patient does not exist by given id"));
    }

    public PatientInfo addPatient(long physiotherapistId, String firstName, String lastName, String emailAddress, LocalDate dateOfBirth,
                           int age, int length, int weight) {
        Physiotherapist physiotherapist = physiotherapistService.getPhysiotherapist(physiotherapistId);
        Patient patient = new Patient(firstName, lastName, emailAddress, dateOfBirth, age, length, weight);

        physiotherapist.addPatient(patient);
        patientRepository.save(patient);
        return new PatientInfo(patient);
    }

    public PatientInfo getPatientInfo(long id) {
        Patient patient = tryFindingPatientById(id);
        return new PatientInfo(patient);
    }
}
