package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.service.PatientService;
import fysiotherapie.physiotherapy.presentation.dto.request.NewPatient;
import fysiotherapie.physiotherapy.presentation.dto.response.PatientInfo;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("physiotherapists/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<String> addPatient(Neo4jProperties.Authentication authentication, @RequestBody NewPatient newPatient) {
        String username = authentication.getUsername();

        long id = patientService.addPatient(username,
                newPatient.firstName, newPatient.lastName, newPatient.email,
                newPatient.dateOfBirth, newPatient.age, newPatient.length, newPatient.weight);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).body("Patient created with id " + id);
    }

    @GetMapping("{id}")
    public ResponseEntity<PatientInfo> getPatientInfo(@PathVariable long id) {
        PatientInfo patientInfo = patientService.getPatientInfo(id);
        return ResponseEntity.ok().body(patientInfo);
    }
}
