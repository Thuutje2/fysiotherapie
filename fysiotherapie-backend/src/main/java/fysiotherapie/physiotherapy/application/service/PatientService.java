package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.application.exception.PatientNotFoundException;
import fysiotherapie.physiotherapy.application.exception.PatientNotUniqueException;
import fysiotherapie.physiotherapy.application.exception.TreatmentDoesNotBelongToPatientException;
import fysiotherapie.physiotherapy.data.PatientRepository;
import fysiotherapie.physiotherapy.domain.Patient;
import fysiotherapie.physiotherapy.domain.Physiotherapist;
import fysiotherapie.physiotherapy.application.dto.response.PatientInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

    private List<Patient> tryFindingAllPatientsForPhysiotherapistById(long id) {
        return patientRepository.findAllByPhysiotherapistId(id);
    }

    private void isPatientUnique(String email) {
        if (patientRepository.existsByEmail(email)) {
            throw new PatientNotUniqueException("Patient already exists by given email address");
        }
    }

    private void savePatient(Patient patient) {
        patientRepository.save(patient);
    }

    private PatientInfo convertToPatientInfo(Patient patient) {
        int age = Patient.calculateAge(patient.getDateOfBirth());
        return new PatientInfo(patient, age);
    }

    private List<PatientInfo> convertToPatientInfoList(List<Patient> patients) {
        return patients.stream()
                .map(this::convertToPatientInfo)
                .collect(Collectors.toList());
    }

    public Patient tryFindingPatientByEmail(String email) {
        return patientRepository.findByEmail(email).orElseThrow(()->
                new PatientNotFoundException("Patient does not exist by given email"));
    }

    public void checkTreatmentBelongsToPatient(long patientId, long treatmentId) {
        if (!patientRepository.existsByIdAndTreatmentId(patientId, treatmentId)) {
            throw new TreatmentDoesNotBelongToPatientException("Treatment does not belong to patient");
        }
    }

    public PatientInfo addPatient(String physiotherapistEmail, String firstName, String lastName, String email,
                           LocalDate dateOfBirth, double length, double weight) {

        Patient patient = new Patient(firstName, lastName, email, dateOfBirth, length, weight);
        Physiotherapist physiotherapist = physiotherapistService.getPhysiotherapistByEmail(physiotherapistEmail);

        isPatientUnique(email);
        physiotherapist.addPatient(patient);
        savePatient(patient);

        return convertToPatientInfo(patient);
    }

    public Patient getPatient(long id) {
        return tryFindingPatientById(id);
    }

    public PatientInfo getPatientInfoById(long id) {
        Patient patient = tryFindingPatientById(id);
        return convertToPatientInfo(patient);
    }

    public PatientInfo getPatientInfoByEmail(String email) {
        Patient patient = tryFindingPatientByEmail(email);
        return convertToPatientInfo(patient);
    }

    public List<PatientInfo> getAllPatientsForPhysiotherapistByEmail(String email) {
        Physiotherapist physiotherapist = physiotherapistService.getPhysiotherapistByEmail(email);
        List<Patient> patients = tryFindingAllPatientsForPhysiotherapistById(physiotherapist.getId());
        return convertToPatientInfoList(patients);
    }
}
