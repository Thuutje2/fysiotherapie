export default class MeasurementService {
    static async uploadMeasurement(formData, patientId, treatmentId) {
        const fetchOptions = {
            method: "POST",
            headers: {"Authorization": "Bearer " + sessionStorage.getItem("myToken")},
            body: formData
        }
        const response = await fetch(
            `http://localhost:8080/patients/${patientId}\`/treatments/${treatmentId}/measurements`, fetchOptions)
        if (response.ok) {
            return {success: true}
        } else {
            const errorText = await response.text();
            return {success: false, error: errorText || "Uploaden van bestand mislukt. Probeer opnieuw"}
        }
    }
}
