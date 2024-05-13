package fysiotherapie.physiotherapy.presentation.exception;

import fysiotherapie.physiotherapy.application.exception.PatientNotFoundException;
import fysiotherapie.physiotherapy.application.exception.PatientNotUniqueException;
import fysiotherapie.physiotherapy.application.exception.PhysiotherapistNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(PatientNotFoundException.class)
    public ResponseEntity<String> handlePatientNotFoundException(PatientNotFoundException pnfe) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(pnfe.getMessage());
    }

    @ExceptionHandler(PhysiotherapistNotFoundException.class)
    public ResponseEntity<String> handlePhysiotherapistNotFoundException(PhysiotherapistNotFoundException pnfe) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(pnfe.getMessage());
    }

    @ExceptionHandler(PatientNotUniqueException.class)
    public ResponseEntity<String> handlePatientNotUniqueException(PatientNotUniqueException pnue) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(pnue.getMessage());
    }
}