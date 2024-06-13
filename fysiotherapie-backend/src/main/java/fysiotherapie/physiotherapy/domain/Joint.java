package fysiotherapie.physiotherapy.domain;

import jakarta.persistence.*;

import java.util.Map;

@Entity(name = "joints")
public class Joint {
    @Id
    @GeneratedValue
    private Long id;
//    @Enumerated(EnumType.STRING)
//    private JointType type;

    private String jointType;

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
                ", jointType='" + getJointType() + '\'' +
                ", secondsToPosition=" + getSecondsToPosition() +
                '}';
    }

    public Map<Double, Double> getSecondsToPosition() {
        return secondsToPosition;
    }

    public void setSecondsToPosition(Map<Double, Double> secondsToPosition) {
        this.secondsToPosition = secondsToPosition;
    }

    public String getJointType() {
        return jointType;
    }

    public void setJointType(String jointType) {
        this.jointType = jointType;
    }
}
