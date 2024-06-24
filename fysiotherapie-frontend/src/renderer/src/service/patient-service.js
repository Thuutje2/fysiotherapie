export default class PatientService {
    static getBaseUrl() {
        return 'http://localhost:8080';
    }

    static getFetchOptionsGet() {
        return {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("myToken")
            }
        };
    }

    static getFetchOptionsPost(data) {
        return {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("myToken")
            },
            body: JSON.stringify(data)
        };
    }

    static getFetchOptionsPostFormData(data) {
        return {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("myToken")
            },
            body: data
        };
    }

    static handleTokenExpiration(response) {
        if (response.status === 401) {
            window.location.href = "/login";
        }
    }

    static async fetchData(url, options) {
        try {
            const response = await fetch(url, options);
            this.handleTokenExpiration(response);
            if (response.ok) {
                return { success: true, data: await response.json() };
            } else {
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getAllPatientsOfPhysio() {
        debugger;
        const url = `${this.getBaseUrl()}/patients`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getPatientById(patientId) {
        const url = `${this.getBaseUrl()}/patients/${patientId}`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getPatientDetails() {
        const url = `${this.getBaseUrl()}/patients/details`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async postPatient(dataPatient) {
        const url = `${this.getBaseUrl()}/patients`;
        return this.fetchData(url, this.getFetchOptionsPost(dataPatient));
    }

    static async postTreatment(patientId, dataTreatment) {
        const url = `${this.getBaseUrl()}/patients/${patientId}/treatments`;
        return this.fetchData(url, this.getFetchOptionsPost(dataTreatment));
    }

    static async getTreatmentsByPatientId(patientId) {
        const url = `${this.getBaseUrl()}/patients/${patientId}/treatments`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getMeasurements(patientId, treatmentId) {
        const url = `${this.getBaseUrl()}/patients/${patientId}/treatments/${treatmentId}/measurements`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getMeasurementForPhysio(patientId, treatmentId, measurementId) {
        const url = `${this.getBaseUrl()}/patients/${patientId}/treatments/${treatmentId}/measurements/${measurementId}`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getMeasurementForPhysioPerJoint(patientId, treatmentId, measurementId, jointType) {
        const url = `${this.getBaseUrl()}/patients/${patientId}/treatments/${treatmentId}/measurements/${measurementId}/joints/${jointType}`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getMeasurementForPatientPerJoint(treatmentId, measurementId, jointType) {
        const url = `${this.getBaseUrl()}/treatments/${treatmentId}/measurements/${measurementId}/joints/${jointType}`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getMeasurementForPatient(treatmentId, measurementId) {
        const url = `${this.getBaseUrl()}/treatments/${treatmentId}/measurements/${measurementId}`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getJointTypesForPhysio(patientId, treatmentId, measurementId) {
        const url = `${this.getBaseUrl()}/patients/${patientId}/treatments/${treatmentId}/measurements/${measurementId}/joints`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async getJointTypesForPatient(treatmentId, measurementId) {
        const url = `${this.getBaseUrl()}/treatments/${treatmentId}/measurements/${measurementId}/joints`;
        return this.fetchData(url, this.getFetchOptionsGet());
    }

    static async postMeasurement(patientId, treatmentId, dataMeasurement) {
        const url = `${this.getBaseUrl()}/patients/${patientId}/treatments/${treatmentId}/measurements`;
        return this.fetchData(url, this.getFetchOptionsPostFormData(dataMeasurement));
    }
}
