package fysiotherapie.physiotherapy.application;

import fysiotherapie.physiotherapy.application.exception.PatientNotFoundException;
import fysiotherapie.physiotherapy.data.PatientRepository;
import fysiotherapie.physiotherapy.domain.Patient;
import fysiotherapie.physiotherapy.domain.Physiotherapist;
import fysiotherapie.physiotherapy.presentation.dto.response.PatientInfo;
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

    private void savePatient(Patient patient) {
        patientRepository.save(patient);
    }

    public PatientInfo addPatient(String physiotherapistEmail, String firstName, String lastName, String emailAddress, LocalDate dateOfBirth,
                           int age, double length, double weight) {

        Patient patient = new Patient(firstName, lastName, emailAddress, dateOfBirth, age, length, weight);

        Physiotherapist physiotherapist = physiotherapistService.getPhysiotherapistByEmail(physiotherapistEmail);
        physiotherapist.addPatient(patient);

        savePatient(patient);

        return new PatientInfo(patient);
    }

    public PatientInfo getPatientInfo(long id) {
        Patient patient = tryFindingPatientById(id);
        return new PatientInfo(patient);
    }
}
