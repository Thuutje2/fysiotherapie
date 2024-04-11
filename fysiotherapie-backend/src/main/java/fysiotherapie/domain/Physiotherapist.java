package fysiotherapie.domain;

import java.util.ArrayList;
import java.util.List;

public class Physiotherapist {
    private String name;
    private String facilityName;
    private List<Patient> patients = new ArrayList<>();

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
