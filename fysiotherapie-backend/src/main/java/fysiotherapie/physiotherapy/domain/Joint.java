package fysiotherapie.physiotherapy.domain;

import fysiotherapie.physiotherapy.domain.enums.JointType;
//import fysiotherapie.domain.enums.JointType;
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
    private Map<String, String> secondsToPosition;


    public Joint(){}

    public Joint(Map<String, String> secondsToPosition) {;
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

    public Map<String, String> getSecondsToPosition() {
        return secondsToPosition;
    }

    public void setSecondsToPosition(Map<String, String> secondsToPosition) {
        this.secondsToPosition = secondsToPosition;
    }

    public String getJointType() {
        return jointType;
    }

    public void setJointType(String jointType) {
        this.jointType = jointType;
    }
}
