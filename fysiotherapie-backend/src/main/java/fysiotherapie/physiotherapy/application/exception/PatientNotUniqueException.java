package fysiotherapie.physiotherapy.application.exception;

public class PatientNotUniqueException extends RuntimeException {
    public PatientNotUniqueException(String message) {
        super(message);
    }
}
