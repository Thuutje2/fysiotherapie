package fysiotherapie.physiotherapy.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue
    private Long id;
    private LocalDate date;
    private LocalTime time;
    @OneToMany
    @JoinColumn(name = "appointment_id")
    private List<Activity> activities = new ArrayList<>();

    public Appointment(){}

    public Appointment(LocalDate date, LocalTime time) {
        this.date = date;
        this.time = time;
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

        Appointment appointment = (Appointment) o;
        return Objects.equals(date, appointment.date)
                && Objects.equals(time, appointment.time);
    }
}
