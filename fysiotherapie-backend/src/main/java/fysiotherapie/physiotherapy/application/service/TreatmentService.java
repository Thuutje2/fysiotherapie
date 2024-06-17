package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.application.exception.TreatmentNotFoundException;
import fysiotherapie.physiotherapy.application.exception.TreatmentNotUniqueException;
import fysiotherapie.physiotherapy.data.TreatmentRepository;
import fysiotherapie.physiotherapy.domain.Measurement;
import fysiotherapie.physiotherapy.domain.Patient;
import fysiotherapie.physiotherapy.domain.Treatment;
import fysiotherapie.physiotherapy.application.dto.response.TreatmentInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TreatmentService {
    private final TreatmentRepository treatmentRepository;
    private final PatientService patientService;

    public TreatmentService(PatientService patientService, TreatmentRepository treatmentRepository) {
        this.patientService = patientService;
        this.treatmentRepository = treatmentRepository;
    }

    private Treatment tryFindingTreatmentById(long id) {
        return treatmentRepository.findById(id).orElseThrow(()->
                new TreatmentNotFoundException("Treatment does not exist by given id"));
    }

    private List<Treatment> findTreatmentsByPatient(long patientId) {
        Patient patient = patientService.getPatient(patientId);
        return patient.getTreatments();
    }

    private void isTreatmentUnique(long patientId, Treatment treatment) {
        List<Treatment> treatments = findTreatmentsByPatient(patientId);
        for (Treatment existingTreatment : treatments) {
            if (existingTreatment.equals(treatment)) {
                throw new TreatmentNotUniqueException("Duplicate treatment found for patient");
            }
        }
    }

    public void addMeasurementToTreatment(long treatmentId, Measurement measurement) {
        Treatment treatment = tryFindingTreatmentById(treatmentId);
        treatment.addMeasurement(measurement);
        treatmentRepository.save(treatment);
    }

    public TreatmentInfo addTreatment(long patientId, LocalDate startDate, LocalDate endDate, String condition) {
        Patient patient = patientService.getPatient(patientId);
        Treatment treatment = new Treatment(startDate, endDate, condition);

        isTreatmentUnique(patientId, treatment);

        patient.addTreatment(treatment);

        treatmentRepository.save(treatment);

        return new TreatmentInfo(treatment);
    }

    public void deleteTreatment(long treatmentId) {
        Treatment treatment = tryFindingTreatmentById(treatmentId);
        treatmentRepository.delete(treatment);
    }

    public List<TreatmentInfo> getTreatments(long patientId) {
        List<Treatment> treatments = findTreatmentsByPatient(patientId);
        return treatments.stream()
                .map(TreatmentInfo::new)
                .collect(Collectors.toList());
    }
}
