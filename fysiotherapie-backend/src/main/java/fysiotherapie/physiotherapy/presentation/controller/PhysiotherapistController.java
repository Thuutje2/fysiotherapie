package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.service.PhysiotherapistService;
import fysiotherapie.physiotherapy.domain.Joint;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
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

    @PostMapping(value = "/fileupload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadCsvFile(MultipartFile file, HttpServletRequest request) {
        System.out.println("Content-Type: " + request.getContentType());
        physiotherapistService.parseCsvToCorrectFormat(file);
    }

    @GetMapping(value = "/getgraph/{joint}")
    public ResponseEntity<List<Joint>> getGraphInfo(@PathVariable String joint) {



        return null;
    }

    @GetMapping(value = "/getAllJointsForPatient/{email}")
    public ResponseEntity<List<Joint>> getAllJoints(@PathVariable String email) {
        System.out.println(email);
        return ResponseEntity.ok(physiotherapistService.getAllJointsForPatient(email));
    }
}
