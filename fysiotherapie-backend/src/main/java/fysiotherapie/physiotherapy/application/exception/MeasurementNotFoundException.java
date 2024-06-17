package fysiotherapie.physiotherapy.application.exception;

public class MeasurementNotFoundException extends RuntimeException {
    public MeasurementNotFoundException(String message) {
        super(message);
    }
}
