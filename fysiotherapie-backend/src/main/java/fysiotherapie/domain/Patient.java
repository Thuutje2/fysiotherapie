package fysiotherapie.domain;

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
    private String emailAddress;
    private LocalDate dateOfBirth;
    private int age;
    private int length;
    private int weight;
    @OneToMany
    @JoinColumn(name = "patient_id")
    private List<Treatment> treatments = new ArrayList<>();

    public Patient(){}

    public Patient(String firstName, String lastName, String emailAddress, LocalDate dateOfBirth, int age, int length, int weight) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
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

    public String getEmailAddress() {
        return emailAddress;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public int getAge() {
        return age;
    }

    public int getLength() {
        return length;
    }

    public int getWeight() {
        return weight;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Patient patient = (Patient) o;
        return Objects.equals(emailAddress, patient.emailAddress);
    }
}
