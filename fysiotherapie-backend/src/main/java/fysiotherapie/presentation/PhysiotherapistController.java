package fysiotherapie.presentation;

import fysiotherapie.application.PhysiotherapistService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("physiotherapists/physiotherapist")
public class PhysiotherapistController {

    private final PhysiotherapistService physiotherapistService;

    public PhysiotherapistController(PhysiotherapistService physiotherapistService) {
        this.physiotherapistService = physiotherapistService;
    }

    @GetMapping
    public String sayHello() {
        return "Hello from physiotherapist controller!";
    }

    @PostMapping("/fileupload")
    public void uploadCsvFile(@RequestParam("file") MultipartFile file) {
        // TODO: Schrijf een for loop die van elke string in de juiste column plaatst (in de service)
        physiotherapistService.parseCsvToCorrectFormat(file);
    }


}
