package fysiotherapie.presentation;

import fysiotherapie.application.PhysiotherapistService;
import fysiotherapie.domain.Joint;
import fysiotherapie.presentation.dto.response.PatientInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("physiotherapists/physiotherapist")
public class PhysiotherapistController {

    private final PhysiotherapistService physiotherapistService;

    public PhysiotherapistController(PhysiotherapistService physiotherapistService) {
        this.physiotherapistService = physiotherapistService;
    }

    @PostMapping("/fileupload")
    public ResponseEntity<List<Joint>> uploadCsvFile(@RequestParam("file") MultipartFile file) {
        List<Joint> joints = physiotherapistService.parseCsvToCorrectFormat(file);
        return ResponseEntity.ok().body(joints);
    }
}
