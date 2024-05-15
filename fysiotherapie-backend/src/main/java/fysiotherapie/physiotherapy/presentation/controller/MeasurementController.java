package fysiotherapie.physiotherapy.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/patients/{patientId}/treatments/{treatmentId}/")
public class MeasurementController {
    public MeasurementController(){}

//    @PostMapping("measurements")
//    public ResponseEntity<String> addMeasurement(@PathVariable long patientId, @PathVariable long treatmentId,
//                                                 @RequestParam("file") MultipartFile f) {
//
//
//    }
}
