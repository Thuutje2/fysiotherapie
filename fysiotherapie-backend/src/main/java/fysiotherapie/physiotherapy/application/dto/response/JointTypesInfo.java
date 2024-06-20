package fysiotherapie.physiotherapy.application.dto.response;

import fysiotherapie.physiotherapy.domain.Joint;

public class JointTypesInfo {
    public String type;
    public JointTypesInfo(Joint joint) {
        this.type = joint.getType();
    }
}
