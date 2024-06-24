package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.dto.response.JointInfo;
import fysiotherapie.physiotherapy.application.dto.response.JointTypesInfo;
import fysiotherapie.physiotherapy.application.dto.response.MeasurementInfo;
import fysiotherapie.physiotherapy.application.service.MeasurementService;
import fysiotherapie.security.domain.UserProfile;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping
public class MeasurementController {
    private final MeasurementService measurementService;

    public MeasurementController(MeasurementService measurementService) {
        this.measurementService = measurementService;
    }

    @PostMapping("patients/{patientId}/treatments/{treatmentId}/measurements")
    public MeasurementInfo uploadCsvMeasurement(Authentication authentication,
                                     @PathVariable("patientId") Long patientId,
                                     @PathVariable("treatmentId") Long treatmentId,
                                     @RequestParam("file") MultipartFile file,
                                     @RequestParam("activity") String activity) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.saveMeasurement(profile.getUsername(), patientId, treatmentId, activity, file);
    }

    @GetMapping("patients/{patientId}/treatments/{treatmentId}/measurements/{measurementId}")
    public List<JointInfo> getMeasurementForPhysio(Authentication authentication,
                                          @PathVariable("patientId") Long patientId,
                                          @PathVariable("treatmentId") Long treatmentId,
                                          @PathVariable("measurementId") Long measurementId) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.getMeasurementForPhysio(profile.getUsername(), patientId, treatmentId, measurementId);
    }

    @GetMapping("treatments/{treatmentId}/measurements/{measurementId}")
    public List<JointInfo> getMeasurementForPatient(Authentication authentication,
                                                  @PathVariable("treatmentId") Long treatmentId,
                                                  @PathVariable("measurementId") Long measurementId) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.getMeasurementForPatient(profile.getUsername(), treatmentId, measurementId);
    }

    @GetMapping("patients/{patientId}/treatments/{treatmentId}/measurements/{measurementId}/joints/{jointType}")
    public JointInfo getMeasurementForPhysioPerJoint(Authentication authentication,
                                                 @PathVariable("patientId") Long patientId,
                                                 @PathVariable("treatmentId") Long treatmentId,
                                                 @PathVariable("measurementId") Long measurementId,
                                                 @PathVariable("jointType") String jointType) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.getMeasurementForPhysioPerJoint(profile.getUsername(), patientId, treatmentId, measurementId, jointType);
    }

    @GetMapping("treatments/{treatmentId}/measurements/{measurementId}/joints/{jointType}")
    public JointInfo getMeasurementForPatientPerJoint(Authentication authentication,
                                                     @PathVariable("treatmentId") Long treatmentId,
                                                     @PathVariable("measurementId") Long measurementId,
                                                     @PathVariable("jointType") String jointType) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.getMeasurementForPatientPerJoint(profile.getUsername(), treatmentId, measurementId, jointType);
    }

    @GetMapping("patients/{patientId}/treatments/{treatmentId}/measurements/{measurementId}/joints")
    public List<JointTypesInfo> getJointTypesForPhysio(Authentication authentication,
                                        @PathVariable("patientId") Long patientId,
                                        @PathVariable("treatmentId") Long treatmentId,
                                        @PathVariable("measurementId") Long measurementId) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.getJointTypesForPhysio(profile.getUsername(), patientId, treatmentId, measurementId);
    }

    @GetMapping("treatments/{treatmentId}/measurements/{measurementId}/joints")
    public List<JointTypesInfo> getJointTypesForPatient(Authentication authentication,
                                                       @PathVariable("treatmentId") Long treatmentId,
                                                       @PathVariable("measurementId") Long measurementId) {
        UserProfile profile = (UserProfile) authentication.getPrincipal();
        return measurementService.getJointTypesForPatient(profile.getUsername(), treatmentId, measurementId);
    }

    @GetMapping("patients/{patientId}/treatments/{treatmentId}/measurements")
    public List<MeasurementInfo> getMeasurementsPhysio(@PathVariable long patientId, @PathVariable long treatmentId) {
        return measurementService.getMeasurementsForTreatment(patientId, treatmentId);
    }
}
