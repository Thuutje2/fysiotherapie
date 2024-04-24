package fysiotherapie.application.exception;

public class PhysiotherapistNotFoundException extends RuntimeException {
    public PhysiotherapistNotFoundException(String message) {
        super(message);
    }
}
