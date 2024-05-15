package fysiotherapie.physiotherapy.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity(name = "treatments")
//@Table(uniqueConstraints = {
//        @UniqueConstraint(columnNames = {"patient_id", "startDate", "endDate", "condition"})})
public class Treatment {
    @Id
    @GeneratedValue
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String condition;
    @OneToMany
    @JoinColumn(name = "treatment_id")
    private List<Activity> activities = new ArrayList<>();

    public Treatment(){}

    public Treatment(LocalDate startDate, LocalDate endDate, String condition) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.condition = condition;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getCondition() {
        return condition;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void addActivity(Activity activity) {
        activities.add(activity);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Treatment treatment = (Treatment) o;
        return Objects.equals(startDate, treatment.startDate)
                && Objects.equals(endDate, treatment.endDate)
                && Objects.equals(condition, treatment.condition);
    }
}
