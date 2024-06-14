package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.service.TreatmentService;
import fysiotherapie.physiotherapy.presentation.dto.request.NewTreatment;
import fysiotherapie.physiotherapy.application.dto.response.TreatmentInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("patients/{patientId}/treatments")
public class TreatmentController {
    private final TreatmentService treatmentService;

    public TreatmentController(TreatmentService treatmentService) {
        this.treatmentService = treatmentService;
    }

    @GetMapping
    public List<TreatmentInfo> getTreatments(@PathVariable long patientId) {
        return treatmentService.getTreatments(patientId);
    }

    @PostMapping
    public ResponseEntity<String> addTreatment(@PathVariable long patientId, @RequestBody NewTreatment newTreatment) {
        long id = treatmentService.addTreatment(patientId, newTreatment.startDate, newTreatment.endDate, newTreatment.condition);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).body("Treatment created with id " + id);
    }

    @DeleteMapping ("{treatmentId}")
    public ResponseEntity<?> deleteTreatment(@PathVariable long patientId, @PathVariable long treatmentId) {
        treatmentService.deleteTreatment(treatmentId);
        return ResponseEntity.ok().build();
    }
}