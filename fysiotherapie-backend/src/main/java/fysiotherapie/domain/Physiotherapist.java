package fysiotherapie.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "physiotherapists")
public class Physiotherapist {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String facilityName;
    @OneToMany
    @JoinColumn(name = "physiotherapist_id")
    private List<Patient> patients = new ArrayList<>();

    public Physiotherapist(){}

    public Physiotherapist(String name, String facilityName) {
        this.name = name;
        this.facilityName = facilityName;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public void addPatient(Patient patient) {
        if (!patients.contains(patient)) {
            patients.add(patient);
        }
    }
}
