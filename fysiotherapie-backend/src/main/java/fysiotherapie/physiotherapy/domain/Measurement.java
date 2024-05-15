package fysiotherapie.physiotherapy.domain;

import fysiotherapie.physiotherapy.domain.enums.ActivityType;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "measurements")
public class Measurement {
    @Id
    @GeneratedValue
    private Long id;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private ActivityType type;
    @OneToMany
    @JoinColumn(name = "measurement_id")
    private List<Joint> joints = new ArrayList<>();

    public Measurement(){}

    public Measurement(ActivityType type) {
        this.type = type;
    }
}
