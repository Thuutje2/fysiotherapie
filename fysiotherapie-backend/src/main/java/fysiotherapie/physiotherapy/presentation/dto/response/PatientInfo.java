package fysiotherapie.physiotherapy.presentation.dto.response;

import fysiotherapie.physiotherapy.domain.Patient;

import java.time.LocalDate;

public class PatientInfo {
    public long id;
    public String firstName;
    public String lastName;
    public String email;
    public LocalDate dateOfBirth;
    public int age;
    public double length;
    public double weight;

    public PatientInfo(Patient patient) {
        id = patient.getId();
        firstName = patient.getFirstName();
        lastName = patient.getLastName();
        email = patient.getEmail();
        dateOfBirth = patient.getDateOfBirth();
        age = patient.getAge();
        length = patient.getLength();
        weight = patient.getWeight();
    }
}
