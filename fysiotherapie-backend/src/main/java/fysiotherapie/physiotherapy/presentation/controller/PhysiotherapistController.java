package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.service.PhysiotherapistService;
import fysiotherapie.physiotherapy.domain.Joint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
