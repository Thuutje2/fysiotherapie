package fysiotherapie.physiotherapy.domain;

import fysiotherapie.physiotherapy.domain.enums.ActivityType;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "measurements")
public class Measurement {
    @Id
    @GeneratedValue
    private Long id;
    @Enumerated(EnumType.STRING)
    private ActivityType type;
    @OneToMany
    @JoinColumn(name = "measurement_id")
    private List<Joint> joints = new ArrayList<>();

    public Measurement(){}

    public Measurement(ActivityType type, List<Joint> joints) {
        this.type = type;
        this.joints = joints;
    }

    public long getId() {
        return id;
    }

    public List<Joint> getJoints() {
        return this.joints;
    }
}
