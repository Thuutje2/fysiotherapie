package fysiotherapie.physiotherapy.presentation.exception.global;

import fysiotherapie.physiotherapy.application.exception.*;
import fysiotherapie.physiotherapy.presentation.exception.UnauthenticatedException;
import io.jsonwebtoken.ExpiredJwtException;
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

    @ExceptionHandler(JointNotFoundException.class)
    public ResponseEntity<String> handleJointNotFoundException(JointNotFoundException exception) {
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

    @ExceptionHandler(UnauthenticatedException.class)
    public ResponseEntity<String> handleUnauthenticatedException(UnauthenticatedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String> handleExpiredJwtException(ExpiredJwtException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
    }
}