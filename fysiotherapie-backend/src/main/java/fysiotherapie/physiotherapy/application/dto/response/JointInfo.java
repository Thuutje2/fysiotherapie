package fysiotherapie.physiotherapy.application.dto.response;

import fysiotherapie.physiotherapy.domain.Joint;

import java.util.Map;

public class JointInfo {
    public String type;
    public Map<Double, Double> secondsToPosition;

    public JointInfo(Joint joint) {
        this.type = joint.getType();
        this.secondsToPosition = joint.getSecondsToPosition();
    }
}
