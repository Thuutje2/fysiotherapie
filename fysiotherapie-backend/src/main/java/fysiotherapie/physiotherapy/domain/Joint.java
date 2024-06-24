package fysiotherapie.physiotherapy.domain;

import jakarta.persistence.*;

import java.util.Map;

@Entity(name = "joints")
public class Joint {
    @Id
    @GeneratedValue
    private Long id;
    private String type;

    @ElementCollection
    @OrderColumn
    private Map<Double, Double> secondsToPosition;


    public Joint(){}

    public Joint(Map<Double, Double> secondsToPosition) {;
        this.setSecondsToPosition(secondsToPosition);
    }

    @Override
    public String toString() {
        return "Joint{" +
                "id=" + id +
                ", jointType='" + getType() + '\'' +
                ", secondsToPosition=" + getSecondsToPosition() +
                '}';
    }

    public long getId() {
        return id;
    }

    public Map<Double, Double> getSecondsToPosition() {
        return secondsToPosition;
    }

    public void setSecondsToPosition(Map<Double, Double> secondsToPosition) {
        this.secondsToPosition = secondsToPosition;
    }

    public String getType() {
        return type;
    }

    public void setType(String jointType) {
        this.type = jointType;
    }
}
