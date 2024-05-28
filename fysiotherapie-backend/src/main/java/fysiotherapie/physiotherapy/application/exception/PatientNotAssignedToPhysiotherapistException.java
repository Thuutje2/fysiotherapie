package fysiotherapie.physiotherapy.application.exception;

public class PatientNotAssignedToPhysiotherapistException extends RuntimeException {
    public PatientNotAssignedToPhysiotherapistException(String message) {
        super(message);
    }
}
