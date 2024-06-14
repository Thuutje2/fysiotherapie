package fysiotherapie.physiotherapy.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "measurements")
public class Measurement {
    @Id
    @GeneratedValue
    private Long id;
    private String activityType;
    private LocalDate date;
    private LocalTime time;
    @ManyToOne
    @JoinColumn(name = "treatment_id")
    private Treatment treatment;
    @OneToMany
    @JoinColumn(name = "measurement_id")
    private List<Joint> joints = new ArrayList<>();

    public Measurement(){}

    public Measurement(String activityType, LocalDate date, LocalTime time, List<Joint> joints) {
        this.activityType = activityType;
        this.date = date;
        this.time = time;
        this.joints = joints;
    }
    public long getId() {
        return id;
    }

    public String getActivityType() {
        return activityType;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getTime() {
        return time;
    }

    public List<Joint> getJoints() {
        return this.joints;
    }
}
