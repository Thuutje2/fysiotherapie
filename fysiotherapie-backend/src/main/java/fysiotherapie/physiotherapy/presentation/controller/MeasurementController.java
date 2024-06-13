package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.dto.response.JointInfo;
import fysiotherapie.physiotherapy.application.service.MeasurementService;
import fysiotherapie.security.domain.UserProfile;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("patients/{patientId}/treatments/{treatmentId}/measurements")
public class MeasurementController {
    private final MeasurementService measurementService;

    public MeasurementController(MeasurementService measurementService) {
        this.measurementService = measurementService;
    }

    @PostMapping()
    public long uploadCsvMeasurement(Authentication authentication,
                                     @PathVariable("patientId") Long patientId,
                                     @PathVariable("treatmentId") Long treatmentId,
                                     @RequestParam("file") MultipartFile file,
                                     @RequestParam("text") String activityType
//                                     @RequestParam NewMeasurement newMeasurement
    ) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.saveMeasurement(profile.getUsername(), patientId, treatmentId, activityType, file);
    }

    @GetMapping("/{measurementId}")
    public List<JointInfo> getMeasurement(Authentication authentication,
                                          @PathVariable("patientId") Long patientId,
                                          @PathVariable("treatmentId") Long treatmentId,
                                          @PathVariable("measurementId") Long measurementId) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.getMeasurementForPatient(profile.getUsername(), patientId, treatmentId, measurementId);
    }
}
