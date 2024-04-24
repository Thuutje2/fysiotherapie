package fysiotherapie.presentation;

import fysiotherapie.application.PatientService;
import fysiotherapie.presentation.dto.request.NewPatient;
import fysiotherapie.presentation.dto.response.PatientInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("physiotherapists/{id}/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<PatientInfo> createPatient(@PathVariable long id, @RequestBody NewPatient newPatient) {
        PatientInfo patientInfo = patientService.addPatient(id,
                newPatient.firstName, newPatient.lastName, newPatient.emailAddress,
                newPatient.dateOfBirth, newPatient.age, newPatient.length, newPatient.weight);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(patientInfo)
                .toUri();
        return ResponseEntity.created(location).body(patientInfo);
    }

    @GetMapping("{id}")
    public ResponseEntity<PatientInfo> getPatientInfo(@PathVariable long id) {
        PatientInfo patientInfo = patientService.getPatientInfo(id);
        return ResponseEntity.ok().body(patientInfo);
    }
}
