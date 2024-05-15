package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.domain.Joint;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients/{patientId}/treatments/{treatmentId}/measurements/{measurementId}/joints/")
public class JointController {
    public JointController() {}

//    @GetMapping
//    public Joint getJoint(@PathVariable long patientId,
//                          @PathVariable long treatmentId,
//                          @PathVariable long measurementId) {
//
//    }
}
