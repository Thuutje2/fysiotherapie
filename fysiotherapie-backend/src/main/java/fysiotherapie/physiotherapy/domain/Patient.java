package fysiotherapie.physiotherapy.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity(name = "patients")
public class Patient {
    @Id
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private int age;
    private double length;
    private double weight;
    @OneToMany
    @JoinColumn(name = "patient_id")
    private List<Treatment> treatments = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "patient_id")
    private List<Joint> jointsPoints = new ArrayList<>();

    public Patient(){}

    public Patient(String firstName, String lastName, String email, LocalDate dateOfBirth, int age, double length, double weight) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
        this.length = length;
        this.weight = weight;
    }

    public List<Treatment> getTreatments() {
        return treatments;
    }

    public void addTreatment(Treatment treatment) {
        if (!treatments.contains(treatment)) {
            treatments.add(treatment);
        }
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public int getAge() {
        return age;
    }

    public double getLength() {
        return length;
    }

    public double getWeight() {
        return weight;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Patient patient = (Patient) o;
        return Objects.equals(email, patient.email);
    }

    public List<Joint> getJointsPoints() {
        return jointsPoints;
    }

    public void setJointsPoints(List<Joint> jointsPoints) {
        this.jointsPoints = jointsPoints;
    }
}
