import { css, html, LitElement } from "lit";
import PatientService from "../service/patient-service.js";
import {Router} from "@vaadin/router";

class PhysioPatientOverview extends LitElement {
    static get properties() {
        return {
            isPopupVisible: { type: Boolean },
            patients: { type: Array }
        };
    }

    constructor() {
        super();
        this.isPopupVisible = false;
        this.patients = [];
    }

    togglePopup() {
        this.isPopupVisible = !this.isPopupVisible;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadPatients();
    }

    async loadPatients() {
        const result = await PatientService.getAllPatientsOfPhysio();
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
                width: calc(100% - 16px);
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
                background: rgb(50, 151, 223);
                color: white;
                border-radius: 3px;
                cursor: pointer;
                margin-top: 1em;
            }

            #submitButton:hover {
                background-color: rgb(30, 91, 158);;
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
                font-size:13px;
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
                            <td><a href="#" @click="${() => this.handlePatientClick(patient.id)}">${patient.id}</a></td>
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
                            <label for="height">Lengte:</label>
                            <input type="text" id="height" name="height" placeholder="Lengte" required>
                        </div>
                        <button id="submitButton" type="submit">Opslaan</button>
                        <div id="errorMessage" style="display: none;">
                            <div></div>
                        </div>
                    </form>
                </div>
            </div>

        `;
    }

    async handleSubmit(event) {
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

    handlePatientClick(patientId) {
        Router.go(`/physio-patient-details/${patientId}`);
    }
}

customElements.define('physio-patient-overview', PhysioPatientOverview);
