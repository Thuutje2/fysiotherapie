package fysiotherapie.physiotherapy.application.exception;

public class TreatmentNotUniqueException extends RuntimeException {
    public TreatmentNotUniqueException(String message) {
        super(message);
    }
}
