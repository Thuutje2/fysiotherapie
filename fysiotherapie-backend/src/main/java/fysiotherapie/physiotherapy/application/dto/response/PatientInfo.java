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

    public PatientInfo(Patient patient) {
        id = patient.getId();
        firstName = patient.getFirstName();
        lastName = patient.getLastName();
        email = patient.getEmail();
        dateOfBirth = patient.getDateOfBirth();
        age = patient.getAge();
        height = patient.getHeight();
        weight = patient.getWeight();
    }
}
