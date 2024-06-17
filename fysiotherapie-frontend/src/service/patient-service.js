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

    static async getAllPatientsOfPhysio() {
        const response= await fetch("http://localhost:8080/patients", this.getFetchOptionsGet());
        if (response.ok) {
            const patients = await response.json();
            return { success: true, patients: patients }
        }
        else {
            return { success: false }
        }
    }

    static async getPatientById(id) {
        const response= await fetch(`http://localhost:8080/patients/${id}`, this.getFetchOptionsGet());
        if (response.ok) {
            const patient = await response.json();
            return { success: true, patient: patient }
        }
        else {
            return { success: false }
        }
    }

    static async getPatientDetails() {
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

    static async postTreatment(patientId, dataTreatment) {
        const response= await fetch(`http://localhost:8080/patients/${patientId}/treatments`, this.getFetchOptionsPost(dataTreatment));
        if (response.ok) {
            const treatment = await response.json();
            return { success: true, treatment: treatment }
        }
        else if (response.status === 409) {
            return { success: false, error: "De behandeling overlapt met datum van een andere behandeling" }
        }
        else {
            return { success: false, error: "Opslaan mislukt, probeer opnieuw" }
        }
    }

    static async getTreatmentsByPatientId(id) {
        const response= await fetch(`http://localhost:8080/patients/${id}/treatments`, this.getFetchOptionsGet());
        if (response.ok) {
            const treatments = await response.json();
            return { success: true, treatments: treatments }
        }
    }

    static async getMeasurementsByTreatmentId(patientId, treatmentId) {
        const response= await fetch(`http://localhost:8080/patients/${patientId}/treatments/${treatmentId}/measurements`, this.getFetchOptionsGet());
        if (response.ok) {
            const measurements = await response.json();
            return { success: true, measurements: measurements }
        }
    }

    static async getMeasurementById(patientId, treatmentId, measurementId) {
        const response= await fetch(`http://localhost:8080/patients/${patientId}/treatments/${treatmentId}/measurements/${measurementId}`, this.getFetchOptionsGet());
        if (response.ok) {
            const measurement = await response.json();
            return { success: true, measurement: measurement }
        }
    }

    static async postMeasurement(patientId, treatmentId, dataMeasurement) {
        const fetchOptionsPost =
        {
            method: "POST",
            headers: {"Authorization": "Bearer " + sessionStorage.getItem("myToken")},
            body: dataMeasurement
        };

        const response= await fetch(`http://localhost:8080/patients/${patientId}/treatments/${treatmentId}/measurements`, fetchOptionsPost);
        if (response.ok) {
            const measurement = await response.json();
            return { success: true, measurement: measurement }
        }
        else {
            return { success: false, error: "Opslaan mislukt, probeer opnieuw" }
        }
    }
}

