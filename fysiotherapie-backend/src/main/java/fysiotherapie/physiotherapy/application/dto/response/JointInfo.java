package fysiotherapie.physiotherapy.application.dto.response;

import fysiotherapie.physiotherapy.domain.Joint;

import java.util.Map;

public class JointInfo {
    public String jointType;
    public Map<Double, Double> secondsToPosition;

    public JointInfo(Joint joint) {
        this.jointType = joint.getJointType();
        this.secondsToPosition = joint.getSecondsToPosition();
    }
}
