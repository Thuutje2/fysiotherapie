package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.dto.response.JointInfo;
import fysiotherapie.physiotherapy.application.dto.response.MeasurementInfo;
import fysiotherapie.physiotherapy.application.dto.response.TreatmentInfo;
import fysiotherapie.physiotherapy.application.service.MeasurementService;
import fysiotherapie.physiotherapy.application.service.TreatmentService;
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
    public MeasurementInfo uploadCsvMeasurement(Authentication authentication,
                                     @PathVariable("patientId") Long patientId,
                                     @PathVariable("treatmentId") Long treatmentId,
                                     @RequestParam("file") MultipartFile file,
                                     @RequestParam("activity") String activity) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.saveMeasurement(profile.getUsername(), patientId, treatmentId, activity, file);
    }

    @GetMapping("/{measurementId}")
    public List<JointInfo> getMeasurementPerJoint(Authentication authentication,
                                          @PathVariable("patientId") Long patientId,
                                          @PathVariable("treatmentId") Long treatmentId,
                                          @PathVariable("measurementId") Long measurementId) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.getMeasurementForPatient(profile.getUsername(), patientId, treatmentId, measurementId);
    }

    @GetMapping
    public List<MeasurementInfo> getMeasurements(@PathVariable long patientId, @PathVariable long treatmentId) {
        return measurementService.getMeasurementsForTreatment(patientId, treatmentId);
    }
}
