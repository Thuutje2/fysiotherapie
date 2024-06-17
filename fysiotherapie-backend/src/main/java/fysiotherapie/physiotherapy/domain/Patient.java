package fysiotherapie.physiotherapy.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.Period;
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
    private double height;
    private double weight;
    @ManyToOne
    @JoinColumn(name = "physiotherapist_id")
    private Physiotherapist physiotherapist;
    @OneToMany
    @JoinColumn(name = "patient_id")
    private List<Treatment> treatments = new ArrayList<>();

    public Patient(){}

    public Patient(String firstName, String lastName, String email, LocalDate dateOfBirth, double height, double weight) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.height = height;
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

    public static int calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return 0;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
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

    public double getHeight() {
        return height;
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
}
