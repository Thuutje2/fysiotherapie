import { css, html, LitElement } from "lit";
import PatientService from "../service/patient-service.js";

class PatientOverview extends LitElement {
    static get properties() {
        return {
            isPopupVisible: { type: Boolean },
            patients: { type: Array },
            isTreatmentPopupVisible: { type: Boolean },
            selectedPatient: { type: Object },
            treatments: {type: Array }
        };
    }

    constructor() {
        super();
        this.isPopupVisible = false;
        this.patients = [];
        this.isTreatmentPopupVisible = false;
        this.selectedPatient = null;
        this.treatments = [];
    }

    togglePopup() {
        this.isPopupVisible = !this.isPopupVisible;
    }

    toggleTreatmentPopup(patient = null) {
        this.isTreatmentPopupVisible = !this.isTreatmentPopupVisible;
        this.selectedPatient = patient
        if (this.isTreatmentPopupVisible) {
            this.treatments = [
                { date: 1, name: 'Behandeling 1' },
                { date: 2, name: 'Behandeling 2' },
                { date: 3, name: 'Behandeling 3' },
                { date: 1, name: 'Behandeling 1' },
                { date: 2, name: 'Behandeling 2' },
                { date: 3, name: 'Behandeling 3' },
                { date: 1, name: 'Behandeling 1' },
                { date: 2, name: 'Behandeling 2' },
                { date: 3, name: 'Behandeling 3' },
                { date: 1, name: 'Behandeling 1' },
                { date: 2, name: 'Behandeling 2' },
                { date: 3, name: 'Behandeling 3' }
            ]
        }
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadPatients();
    }

    async loadPatients() {
        debugger;
        const result = await PatientService.getPatientsForPhysio();
        if (result.success === true ) {
            this.patients = result.patients;
        }
    }

    static get styles() {
        return css`
        :host {
            display: block;
            padding: 1em;
            position: relative;
        }

        .container {
            position: relative;
        }

        .add-button {
            position: absolute;
            top: 0;
            right: 0;
            margin: 1em;
        }

        .add-button {
            cursor: pointer;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
            width: 150px;
            position: relative;
        }

        th {
            background-color: #f2f2f2;
        }

        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .overlay[visible] {
            display: flex;
        }

        .popup {
            background-color: white;
            padding: 2em;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .popup form {
            display: flex;
            flex-direction: column;
        }

        .popup form label {
            display: inline-block;
            width: 120px;
            margin-right: 10px;
        }

        .popup form input {
            margin-bottom: 1em;
            padding: 0.5em;
            border: 1px solid #ccc;
            border-radius: 3px;
        }

        .popup form button {
            padding: 0.5em;
            border: none;
            background-color: #007BFF;
            color: white;
            border-radius: 3px;
            cursor: pointer;
        }

        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
        }

        #submitButton {
            padding: 0.5em 2em;
            border: none;
            background-color: #3297DF;
            color: white;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 1em;
        }

        #submitButton:hover {
            background-color: #0056b3;
        }

        #errorMessage {
            color: #ff0000;
            font-weight: bold;
            margin: 5px;
            padding: 5px;
            background-color: #facdca;
            border-style: solid;
            border-color: #ff0000;
            border-radius: 10px;
            display: none;
            font-size: 13px;
        }

        /* Behandeling popup CSS */
        .treatment-popup {
            background-color: white;
            padding: 2em;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
            position: relative;
            width: 80%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            max-height: 50%;
            overflow-y: auto;
        }

        .treatment-popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 1em;
        }

        .patient-number {
            font-weight: bold;
            position: absolute;
            top: 10px;
            left: 10px;
        }

        .treatment-popup-content {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .treatment-list {
            width: 45%;
            border-right: 1px solid #ccc;
            padding-right: 1em;
            overflow-y: auto;
        }

        .treatment-list h4 {
            margin-top: 0;
        }

        .treatment-list ul {
            list-style: none;
            padding: 0;
        }

        .treatment-list li {
            margin-bottom: 0.5em;
        }

        .treatment-popup form {
            display: flex;
            flex-direction: column;
            width: 45%;
        }

        .treatment-popup form label {
            display: inline-block;
            width: 120px;
            margin-right: 10px;
        }

        .treatment-popup form input {
            margin-bottom: 1em;
            padding: 0.5em;
            border: 1px solid #ccc;
            border-radius: 3px;
        }

        .treatment-popup form button {
            padding: 0.5em;
            border: none;
            background-color: #007BFF;
            color: white;
            border-radius: 3px;
            cursor: pointer;
        }
          
    `;
    }


    render() {
        return html`
            <div class="container">
                <h2>Patiëntenoverzicht</h2>
                <button @click="${this.togglePopup}" class="add-button">Voeg patiënt toe</button>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Voornaam</th>
                        <th>Achternaam</th>
                        <th>Email</th>
                        <th>Geboortedatum</th>
                        <th>Leeftijd</th>
                        <th>Lengte</th>
                        <th>Gewicht</th>
                    </tr>
                    ${this.patients.map(patient => html`
                        <tr>
                            <td>
                                <a href="#"
                                   @click="${() => this.toggleTreatmentPopup(patient)}"
                                   >
                                    ${patient.id}
                                </a>
                            </td>
                            <td>${patient.firstName}</td>
                            <td>${patient.lastName}</td>
                            <td>${patient.email}</td>
                            <td>${patient.dateOfBirth}</td>
                            <td>${patient.age}</td>
                            <td>${patient.height}</td>
                            <td>${patient.weight}</td>
                        </tr>
                    `)}
                </table>
            </div>
            <div class="overlay" ?visible="${this.isPopupVisible}">
                <div class="popup">
                    <button class="close-button" @click="${this.togglePopup}">&times;</button>
                    <h3>Voeg een nieuwe patiënt toe</h3>
                    <form @submit="${this.handleSubmit}">
                        <div>
                            <label for="firstName">Voornaam:</label>
                            <input type="text" id="firstName" name="firstName" placeholder="Voornaam" required>
                        </div>
                        <div>
                            <label for="lastName">Achternaam:</label>
                            <input type="text" id="lastName" name="lastName" placeholder="Achternaam" required>
                        </div>
                        <div>
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" placeholder="Email" required>
                        </div>
                        <div>
                            <label for="dateOfBirth">Geboortedatum:</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" placeholder="Geboortedatum" required>
                        </div>
                        <div>
                            <label for="weight">Gewicht:</label>
                            <input type="text" id="weight" name="weight" placeholder="Gewicht" required>
                        </div>
                        <div>
                            <label for="height">Lengte (cm):</label>
                            <input type="text" id="height" name="height" placeholder="Lengte" required>
                        </div>
                        <button id="submitButton" type="submit">Opslaan</button>
                        <div id="errorMessage" style="display: none;">
                            <div></div>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="overlay" ?visible="${this.isTreatmentPopupVisible}">
                <div class="treatment-popup">
                    <button class="close-button" @click="${this.toggleTreatmentPopup}">&times;</button>
                    <div class="patient-number">
                        Patiëntnummer: ${this.selectedPatient?.id}
                    </div>
                    <div class="treatment-popup-content">
                        <div>
                            <h3>Voeg een behandeling toe</h3>
                            <form @submit="${this.handleTreatmentSubmit}">
                                <div>
                                    <label for="treatmentName">Behandeling:</label>
                                    <input type="text" id="treatmentName" name="treatmentName" placeholder="Behandeling" required>
                                </div>
                                <div>
                                    <label for="treatmentDate">Startdatum:</label>
                                    <input type="date" id="treatmentDate" name="treatmentDate" placeholder="Datum" required>
                                </div>
                                <button id="submitButton" type="submit">Opslaan</button>
                                <div id="errorMessage" style="display: none;">
                                    <div></div>
                                </div>
                            </form>
                        </div>
                        <div class="treatment-list">
                            <h4>Bestaande behandelingen</h4>
                            <ul>
                                ${this.treatments.map(treatment => html`
                                <li>${treatment.date}, ${treatment.name}</li>
                                `)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        `;
    }

    // dit moet eigenlijk onder <h4>Bestaande behandelingen</h4> in de ul
//     ${this.selectedPatient?.treatments?.map(treatment => html`
//     <li>${treatment.name} - ${treatment.date}</li>
//      `) || html`<li>Geen behandelingen gevonden</li>`}


    async handleSubmit(event) {
        debugger;
        event.preventDefault();
        const formData = new FormData(event.target);
        const patient = Object.fromEntries(formData.entries());
        const result = await PatientService.postPatient(patient);

        if (result.success === true) {
            this.patients = [...this.patients, result.patient];
            this.togglePopup();
        }
        else {
            const errorMessage = this.shadowRoot.getElementById("errorMessage");
            errorMessage.innerText = result.error;
            errorMessage.style.display = "block";
        }
    }

    showPopup(event) {
        const popup = document.createElement('div');
        popup.textContent = "Behandeling toevoegen";
        popup.classList.add('popup');
        event.target.appendChild(popup);
    }

    hidePopup(event){
        const popup = event.target.querySelector('.popup');
        if (popup) {
            popup.remove();
        }
    }
}

customElements.define('patient-overview', PatientOverview);
