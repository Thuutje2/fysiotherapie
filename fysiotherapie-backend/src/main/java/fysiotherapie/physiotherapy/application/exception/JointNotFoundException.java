package fysiotherapie.physiotherapy.application.exception;

public class JointNotFoundException extends RuntimeException {
    public JointNotFoundException(String message) {
        super(message);
    }
}
