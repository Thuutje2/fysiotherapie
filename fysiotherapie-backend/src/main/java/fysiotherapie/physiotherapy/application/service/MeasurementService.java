package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.application.dto.response.JointInfo;
import fysiotherapie.physiotherapy.application.dto.response.MeasurementInfo;
import fysiotherapie.physiotherapy.application.exception.MeasurementNotFoundException;
import fysiotherapie.physiotherapy.data.MeasurementRepository;
import fysiotherapie.physiotherapy.domain.Joint;
import fysiotherapie.physiotherapy.domain.Measurement;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class MeasurementService {
    private final MeasurementRepository measurementRepository;
    private final PhysiotherapistService physiotherapistService;
    private final PatientService patientService;
    private final TreatmentService treatmentService;
    private final JointService jointService;

    public MeasurementService(MeasurementRepository measurementRepository,
                              PhysiotherapistService physiotherapistService, PatientService patientService,
                              TreatmentService treatmentService,
                              JointService jointService) {
        this.measurementRepository = measurementRepository;
        this.physiotherapistService = physiotherapistService;
        this.patientService = patientService;
        this.treatmentService = treatmentService;
        this.jointService = jointService;
    }

    private List<Joint> parseCsvToJoints(MultipartFile file) {
        List<Joint> joints = new ArrayList<>();
        try {
            if (file != null && !file.isEmpty()) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    int lineCount = 0;
                    List<String[]> dataList = new ArrayList<>();
                    while ((line = reader.readLine()) != null && lineCount < (file.getSize() - 1)) {
                        if (lineCount >= 2) {
                            String[] parsedLine = line.split(",");
                            dataList.add(parsedLine);
                        }
                        lineCount++;
                    }
                    joints = dataProcessor(dataList);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return joints;
    }

    private List<Joint> dataProcessor(List<String[]> dataList) {
        List<String> seconds = new ArrayList<>();
        List<Joint> joints = new ArrayList<>();

        for(int i = 1; i < dataList.size(); i++) {
            seconds.add(dataList.get(i)[1]);
        }

        for(int i = 2; i < dataList.get(0).length; i++) {
            Map<Double, Double> secondsToPoints = new LinkedHashMap<>();
            Joint newJoint = new Joint();
            newJoint.setJointType(dataList.get(0)[i]);
            for(int j = 2; j < dataList.size() - 4; j++) {
                double time = Double.parseDouble(seconds.get(j));
                double point = Double.parseDouble(dataList.get(j)[i]);
                secondsToPoints.put(time, point);
            }
            newJoint.setSecondsToPosition(secondsToPoints);
            joints.add(newJoint);
        }

        return joints;
    }

    private Measurement tryFindingMeasurementById(long measurementId) {
        return measurementRepository.findById(measurementId).orElseThrow(()->
                new MeasurementNotFoundException("Measurement does not exist by given id"));
    }

    private List<Joint> sortJointsByTime(List<Joint> joints) {
        for (Joint joint : joints) {
            TreeMap<Double, Double> sortedSecondsToPosition = new TreeMap<>(joint.getSecondsToPosition());
            joint.setSecondsToPosition(sortedSecondsToPosition);
        }
        return joints;
    }

    public long saveMeasurement(String physiotherapistUsername, long patientId, long treatmentId, String activityType,
                                MultipartFile file) {
        physiotherapistService.checkIfPatientIsAssignedToPhysiotherapist(physiotherapistUsername, patientId);
        patientService.checkTreatmentBelongsToPatient(patientId, treatmentId);

        List<Joint> joints = parseCsvToJoints(file);
        Measurement measurement = new Measurement(activityType, LocalDate.now(), LocalTime.now(), joints);

        joints.forEach(jointService::saveJoint);
        measurementRepository.save(measurement);
        treatmentService.addMeasurementToTreatment(treatmentId, measurement);
        return measurement.getId();
    }


    public List<JointInfo> getMeasurementForPatient(String physiotherapistUsername, long patientId, long treatmentId,
                                                long measurementId) {
        physiotherapistService.checkIfPatientIsAssignedToPhysiotherapist(physiotherapistUsername, patientId);
        patientService.checkTreatmentBelongsToPatient(patientId, treatmentId);
        Measurement measurement = tryFindingMeasurementById(measurementId);
        List<Joint> joints = measurement.getJoints();
        List<Joint> sortedJoints = sortJointsByTime(joints);
        return sortedJoints.stream()
                .map(JointInfo::new)
                .collect(Collectors.toList());
    }

    public List<MeasurementInfo> getMeasurementsForTreatment(long patientId, long treatmentId) {
        patientService.checkTreatmentBelongsToPatient(patientId, treatmentId);
        List<Measurement> measurements = measurementRepository.findAllByTreatmentId(treatmentId);
        return measurements.stream()
                .map(MeasurementInfo::new)
                .collect(Collectors.toList());
    }
}
