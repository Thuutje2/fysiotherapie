package fysiotherapie.physiotherapy.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity(name = "physiotherapists")
public class Physiotherapist {
    @Id
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    @OneToMany
    @JoinColumn(name = "physiotherapist_id")
    private List<Patient> patients = new ArrayList<>();

    public Physiotherapist(){}

    public Physiotherapist(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public long getId() {
        return id;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public void addPatient(Patient patient) {
        if (!patients.contains(patient)) {
            patients.add(patient);
        }
    }

    public Optional<Patient> getPatientFromPatients(String email) {
        return patients.stream()
                .filter(patient -> patient.getEmail().equals(email))
                .findFirst();
    }
}
