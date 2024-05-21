package fysiotherapie.physiotherapy.presentation.dto.request;

import java.time.LocalDate;

public class NewPatient {
    public String firstName;
    public String lastName;
    public String email;
    public LocalDate dateOfBirth;
    public int age;
    public double length;
    public double weight;
}
