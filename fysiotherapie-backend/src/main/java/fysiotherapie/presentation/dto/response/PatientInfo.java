package fysiotherapie.presentation.dto.response;

import fysiotherapie.domain.Patient;

import java.time.LocalDate;

public class PatientInfo {
    public long id;
    public String firstName;
    public String lastName;
    public String emailAddress;
    public LocalDate dateOfBirth;
    public int age;
    public int length;
    public int weight;

    public PatientInfo(Patient patient) {
        id = patient.getId();
        firstName = patient.getFirstName();
        lastName = patient.getLastName();
        emailAddress = patient.getEmailAddress();
        dateOfBirth = patient.getDateOfBirth();
        age = patient.getAge();
        length = patient.getLength();
        weight = patient.getWeight();
    }
}
