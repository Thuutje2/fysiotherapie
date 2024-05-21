package fysiotherapie.physiotherapy.application.service;

import fysiotherapie.physiotherapy.application.exception.PhysiotherapistNotFoundException;
import fysiotherapie.physiotherapy.data.PhysiotherapistRepository;
import fysiotherapie.physiotherapy.domain.Joint;
import fysiotherapie.physiotherapy.domain.Physiotherapist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PhysiotherapistService {
    private final PhysiotherapistRepository physiotherapistRepository;

    public PhysiotherapistService(PhysiotherapistRepository physiotherapistRepository) {
        this.physiotherapistRepository = physiotherapistRepository;
    }

    private Physiotherapist tryFindingPhysiotherapistById(long id) {
        return physiotherapistRepository.findById(id).orElseThrow(() ->
                new PhysiotherapistNotFoundException("Physiotherapist does not exist by given id"));
    }

    public Physiotherapist getPhysiotherapist(long id) {
        return tryFindingPhysiotherapistById(id);
    }

    public List<Joint> parseCsvToCorrectFormat(MultipartFile file) {
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
                    return joints;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return null;
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
}
