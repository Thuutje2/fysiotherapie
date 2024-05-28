package fysiotherapie.physiotherapy.presentation.exception;

import fysiotherapie.physiotherapy.application.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(PatientNotFoundException.class)
    public ResponseEntity<String> handlePatientNotFoundException(PatientNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(PhysiotherapistNotFoundException.class)
    public ResponseEntity<String> handlePhysiotherapistNotFoundException(PhysiotherapistNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(TreatmentNotFoundException.class)
    public ResponseEntity<String> handleTreatmentNotFoundException(TreatmentNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(MeasurementNotFoundException.class)
    public ResponseEntity<String> handleMeasurementNotFoundException(MeasurementNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(PatientNotAssignedToPhysiotherapistException.class)
    public ResponseEntity<String> handlePatientNotAssignedToPhysiotherapistException(
            PatientNotAssignedToPhysiotherapistException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
    }

    @ExceptionHandler(TreatmentDoesNotBelongToPatientException.class)
    public ResponseEntity<String> handleTreatmentDoesNotBelongToPatientException(
            TreatmentDoesNotBelongToPatientException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
    }

    @ExceptionHandler(TreatmentNotUniqueException.class)
    public ResponseEntity<String> handleTreatmentNotUniqueException(TreatmentNotUniqueException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }

    @ExceptionHandler(PatientNotUniqueException.class)
    public ResponseEntity<String> handlePatientNotUniqueException(PatientNotUniqueException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }
}