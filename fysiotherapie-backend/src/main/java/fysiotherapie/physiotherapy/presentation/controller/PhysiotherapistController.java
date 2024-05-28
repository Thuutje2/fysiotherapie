package fysiotherapie.physiotherapy.presentation.controller;

import fysiotherapie.physiotherapy.application.service.PhysiotherapistService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("physiotherapists")
public class PhysiotherapistController {

    private final PhysiotherapistService physiotherapistService;

    public PhysiotherapistController(PhysiotherapistService physiotherapistService) {
        this.physiotherapistService = physiotherapistService;
    }
}
