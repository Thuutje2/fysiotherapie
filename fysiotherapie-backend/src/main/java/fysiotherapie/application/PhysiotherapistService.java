package fysiotherapie.application;

import fysiotherapie.application.exception.PhysiotherapistNotFoundException;
import fysiotherapie.data.PhysiotherapistRepository;
import fysiotherapie.domain.Joint;
import fysiotherapie.domain.Physiotherapist;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLOutput;
import java.util.*;

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

//    public void parseCsvToCorrectFormat(MultipartFile file) {
//        try {
//            if(file != null && !file.isEmpty()) {
//                String fileAsString = new String(file.getBytes(), StandardCharsets.UTF_8);
//                String[] parsedCsv = fileAsString.split("\r\n|\r|\n");
//
//                String[] parsedParsedCsv;
//
//                for (int i = 0; i < 10; i++) {
////                    parsedCsv[i] = parsedCsv[i].split(",");
//                    parsedParsedCsv = parsedCsv[i].split(",");
//                    System.out.println(parsedParsedCsv[1]);
//
//                }
//
//
//                // Strings zien er als volgt uit:
//                // 0: scorer,DavidPagnon,DavidPagnon, ...
//                // 1: individuals,person0, ...
//                // 2: angs,Time,Right ankle,Left ankle, ...
//                // 3: coords,seconds,dorsiflexion, ...
//                // 4: 0,0.0,5.497115289149576,10.436075558815887, ...
//
//
//            }
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }
}