package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.service.PatientService;
import fysiotherapie.physiotherapy.presentation.dto.request.NewPatient;
import fysiotherapie.physiotherapy.application.dto.response.PatientInfo;
import fysiotherapie.physiotherapy.presentation.exception.UnauthenticatedException;
import fysiotherapie.security.domain.UserProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<String> addPatient(Authentication authentication, @RequestBody NewPatient newPatient) {
        checkAuthentication(authentication);

        UserProfile profile = (UserProfile) authentication.getPrincipal();

        long id = patientService.addPatient(profile.getUsername(),
                newPatient.firstName, newPatient.lastName, newPatient.email,
                newPatient.dateOfBirth, newPatient.age, newPatient.height, newPatient.weight);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).body("Patient created with id " + id);
    }

    @GetMapping("{id}")
    public ResponseEntity<PatientInfo> getPatientInfo(@PathVariable long id) {
        PatientInfo patientInfo = patientService.getPatientInfoById(id);
        return ResponseEntity.ok().body(patientInfo);
    }

    @GetMapping("/patient")
    public ResponseEntity<PatientInfo> getPatientInfo(Authentication authentication) {
        checkAuthentication(authentication);

        UserProfile profile = (UserProfile) authentication.getPrincipal();
        PatientInfo patientInfo = patientService.getPatientInfoByEmail(profile.getUsername());
        return ResponseEntity.ok().body(patientInfo);
    }

    private void checkAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthenticatedException("Unauthenticated");
        }
    }
}
