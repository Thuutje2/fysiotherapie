package fysiotherapie.physiotherapy.application.dto.response;

import fysiotherapie.physiotherapy.domain.Patient;

import java.time.LocalDate;

public class PatientInfo {
    public long id;
    public String firstName;
    public String lastName;
    public String email;
    public LocalDate dateOfBirth;
    public int age;
    public double height;
    public double weight;

    public PatientInfo(Patient patient, int age) {
        this.id = patient.getId();
        this.firstName = patient.getFirstName();
        this.lastName = patient.getLastName();
        this.email = patient.getEmail();
        this.dateOfBirth = patient.getDateOfBirth();
        this.age = age;
        this.height = patient.getHeight();
        this.weight = patient.getWeight();
    }
}
