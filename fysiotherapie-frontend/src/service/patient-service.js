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

    static async getPatientInformationForPhysio(idPatient) {
        const response= await fetch(`http://localhost:8080/patients/${idPatient}`, this.getFetchOptionsGet());
        if (response.ok) {
            const patient = await response.json();
            return { success: true, patient: patient }
        }
        else {
            return { success: false }
        }
    }

    static async getPatientInformationForPatient() {
        const response= await fetch("http://localhost:8080/patients/patient", this.getFetchOptionsGet());
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
            return { success: true}
        }
        else {
            return {success: false}
        }
    }
}

