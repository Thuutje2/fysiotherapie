package fysiotherapie.domain;

import fysiotherapie.domain.enums.JointType;
import jakarta.persistence.*;

@Entity(name = "joints")
public class Joint {
    @Id
    @GeneratedValue
    private Long id;
    @Enumerated(EnumType.STRING)
    private JointType type;

    public Joint(){}

    public Joint(JointType type) {
        this.type = type;
    }
}
