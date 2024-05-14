package fysiotherapie.application;

import fysiotherapie.application.exception.PhysiotherapistNotFoundException;
import fysiotherapie.data.PhysiotherapistRepository;
import fysiotherapie.domain.Physiotherapist;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLOutput;
import java.util.Arrays;

@Service
@Transactional
public class PhysiotherapistService {
    private final PhysiotherapistRepository physiotherapistRepository;

    public PhysiotherapistService(PhysiotherapistRepository physiotherapistRepository) {
        this.physiotherapistRepository = physiotherapistRepository;
    }

    private Physiotherapist tryFindingPhysiotherapistById(long id) {
        return physiotherapistRepository.findById(id).orElseThrow(()->
                new PhysiotherapistNotFoundException("Physiotherapist does not exist by given id"));
    }

    public Physiotherapist getPhysiotherapist(long id) {
        return tryFindingPhysiotherapistById(id);
    }

    public void parseCsvToCorrectFormat(MultipartFile file) {
        try {
            if (file != null && !file.isEmpty()) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    int lineCount = 0;
                    while ((line = reader.readLine()) != null && lineCount < (file.getSize() - 1)) {
                        if (lineCount >= 2) {
                            String[] parsedLine = line.split(",");
//                            System.out.println("Line " + lineCount + ": " + line);
//                            System.out.println(parsedLine.length);
                            dataToJson(parsedLine)
                        }
                        lineCount++;
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void dataToJson(String[] parsedLine) {

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
