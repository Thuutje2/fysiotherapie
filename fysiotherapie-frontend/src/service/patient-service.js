export default class PatientService {
    getFetchOptionsGet(){
        return {
            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("myToken")}
        }
    }

    getFetchOptionsPost(dataPatient){
       return {
           method: "POST",
           headers: {"Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("myToken")},
           body: JSON.stringify(dataPatient)
       };
    }

    async getPatientInformation(idPatient) {
        return await fetch(`http://localhost:8080/physiotherapists/patients/${idPatient}`, this.getFetchOptionsGet())
    }

    async postPatient(dataPatient) {
        return await fetch(`http://localhost:8080/physiotherapists/patients`, this.getFetchOptionsPost(dataPatient))
    }
}

