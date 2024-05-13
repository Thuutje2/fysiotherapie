package fysiotherapie.physiotherapy.domain;

import fysiotherapie.physiotherapy.domain.enums.ActivityType;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "activities")
public class Activity {
    @Id
    @GeneratedValue
    private Long id;
    @Enumerated(EnumType.STRING)
    private ActivityType type;
    @OneToMany
    @JoinColumn(name = "activity_id")
    private List<Joint> joints = new ArrayList<>();

    public Activity(){}

    public Activity(ActivityType type) {
        this.type = type;
    }
}
