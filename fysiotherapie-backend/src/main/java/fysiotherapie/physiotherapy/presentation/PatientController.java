package fysiotherapie.physiotherapy.presentation;

import fysiotherapie.physiotherapy.application.PatientService;
import fysiotherapie.physiotherapy.presentation.dto.request.NewPatient;
import fysiotherapie.physiotherapy.presentation.dto.response.PatientInfo;
import fysiotherapie.security.domain.UserProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<PatientInfo> createPatient(Authentication authentication, @RequestBody NewPatient newPatient) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();

        PatientInfo patientInfo = patientService.addPatient(profile.getUsername(),
                newPatient.firstName, newPatient.lastName, newPatient.email,
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
