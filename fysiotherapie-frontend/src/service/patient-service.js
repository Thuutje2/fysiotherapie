export default class PatientService {
    static getFetchOptionsGet(){
        return {
            method: "GET",
            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + sessionStorage.getItem("myToken")}
        }
    }

    static getFetchOptionsPost(dataPatient){
       return {
           method: "POST",
           headers: {"Content-Type": "application/json", "Authorization": "Bearer " + sessionStorage.getItem("myToken")},
           body: JSON.stringify(dataPatient)
       };
    }

    static async getPatientsForPhysio() {
        const response= await fetch("http://localhost:8080/patients", this.getFetchOptionsGet());
        if (response.ok) {
            const patients = await response.json();
            return { success: true, patients: patients }
        }
        else {
            return { success: false }
        }
    }

    static async getPatientInformationForPatient() {
        const response= await fetch("http://localhost:8080/patients/details", this.getFetchOptionsGet());
        if (response.ok) {
            const patient = await response.json();
            return { success: true, patient: patient }
        }
        else if (response.status === 401) {
            return { success: false, error: "U bent niet ingelogd" }
        }
        else if (response.status === 404) {
            return { success: false, error: "Uw patientgegevens kunnen niet gevonden worden" }
        }
    }

    static async postPatient(dataPatient) {
        const response= await fetch(`http://localhost:8080/patients`, this.getFetchOptionsPost(dataPatient));
        if (response.ok) {
            const patient = await response.json();
            return { success: true, patient: patient }
        }
        else if (response.status === 409) {
            return { success: false, error: "Er is al een patient bekend met dit e-mailadres" }
        }
        else {
            return { success: false, error: "Opslaan mislukt, probeer opnieuw" }
        }
    }
}

