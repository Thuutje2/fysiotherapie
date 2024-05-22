package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.application.exception.PhysiotherapistNotFoundException;
import fysiotherapie.physiotherapy.data.PatientRepository;
import fysiotherapie.physiotherapy.data.PhysiotherapistRepository;
import fysiotherapie.physiotherapy.domain.Joint;
import fysiotherapie.physiotherapy.domain.Patient;
import fysiotherapie.physiotherapy.domain.Physiotherapist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class PhysiotherapistService {
    private final PhysiotherapistRepository physiotherapistRepository;
    private final PatientRepository patientRepository;
    //TODO VERANDER DIT:::::
    Patient test_patient = new Patient("Daan", "test", "test@daan.nl", LocalDate.now(), 21, 195, 95);
    Physiotherapist test_physio = new Physiotherapist("Naad", "tset", "daan@test.nl");

    public PhysiotherapistService(PhysiotherapistRepository physiotherapistRepository, PatientRepository patientRepository) {
        this.physiotherapistRepository = physiotherapistRepository;
        this.patientRepository = patientRepository;
    }

    private Physiotherapist tryFindingPhysiotherapistById(long id) {
        return physiotherapistRepository.findById(id).orElseThrow(() ->
                new PhysiotherapistNotFoundException("Physiotherapist does not exist by given id"));
    }

    public Physiotherapist getPhysiotherapist(long id) {
        return tryFindingPhysiotherapistById(id);
    }

        public void parseCsvToCorrectFormat(MultipartFile file) {
            System.out.println("hoi");
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
                        List<Joint> joints = dataProcessor(dataList);

                        test_patient.setJointsPoints(joints);

//                        patientRepository.save(test_patient);
                        test_physio.addPatient(test_patient);
                        physiotherapistRepository.save(test_physio);

                    }
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        public List<Joint> dataProcessor(List<String[]> dataList) {
            List<String> seconds = new ArrayList<>();
            List<Joint> joints = new ArrayList<>();

            for(int i = 1; i < dataList.size(); i++) {
                seconds.add(dataList.get(i)[1]); // get the seconds
            }

            for(int i = 2; i < dataList.get(0).length; i++) {
                Map<String, String> secondsToPoints = new LinkedHashMap<>();
                Joint newJoint = new Joint();
                newJoint.setJointType(dataList.get(0)[i]);
                for(int j = 2; j < dataList.size() - 4; j++) {
                    secondsToPoints.put(seconds.get(j), dataList.get(j)[i]);
    //                System.out.println(secondsToPoints);
                }
    //            Joint newJoint = new Joint(dataList.get(0)[i], secondsToPoints);
                newJoint.setSecondsToPosition(secondsToPoints);
                joints.add(newJoint);
            }

            return joints;
        }


    private Physiotherapist tryFindingPhysiotherapistByEmail(String email) {
        return physiotherapistRepository.findByEmail(email).orElseThrow(()->
                new PhysiotherapistNotFoundException("Physiotherapist does not exist by given email address"));
    }

    public void savePhysiotherapist(Physiotherapist physiotherapist) {
        physiotherapistRepository.save(physiotherapist);
    }

    public Physiotherapist getPhysiotherapistByEmail(String email) {
        return tryFindingPhysiotherapistByEmail(email);
    }

    public List<Joint> getAllJointsForPatient(String email) {
        Optional<Patient> temp_patient = null;
        try {
            Optional<Physiotherapist> temp_physio = physiotherapistRepository.findByEmail(email);

            // TODO VERANDEREEEEN
            if(temp_physio.isPresent()) {
                temp_patient = temp_physio.get().getPatientFromPatients("daan@test.nl");
            }

            if (temp_patient.isPresent()) {
                return temp_patient.get().getJointsPoints();
            }


            return null;
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return null;
    }
}
