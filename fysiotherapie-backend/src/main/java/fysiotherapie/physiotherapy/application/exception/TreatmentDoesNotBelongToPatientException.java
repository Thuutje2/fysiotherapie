package fysiotherapie.physiotherapy.application.exception;

public class TreatmentDoesNotBelongToPatientException extends RuntimeException {
    public TreatmentDoesNotBelongToPatientException(String message) {
        super(message);
    }
}
