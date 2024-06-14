import { html, css, LitElement } from "lit";
import PatientService from "../service/patient-service.js";
import './patient-details-table.js';
import { Router } from "@vaadin/router";

class PhysioPatientDetails extends LitElement {
    static get properties() {
        return {
            patientId: { type: String },
            patient: { type: Object },
            treatments: { type: Array },
            measurements: { type: Array },
            selectedTreatment: { type: Object },
            isPopupTreatmentVisible: { type: Boolean }
        }
    };

    constructor() {
        super();
        this.patient = null;
        this.treatments = null;
        this.measurements = null;
        this.selectedTreatment = null;
        this.isPopupTreatmentVisible = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.patientId = this.location.params.patientId;
        this.patient = await this.loadPatientDetails(this.patientId);
        this.treatments = await this.loadTreatmentsOfPatient(this.patientId);
    }

    async loadPatientDetails(patientId) {
        const result = await PatientService.getPatientById(patientId);
        if (result.success) {
            return result.patient;
        }
        return null;
    }

    async loadTreatmentsOfPatient(patientId) {
        const result = await PatientService.getTreatmentsByPatientId(patientId);
        if (result.success) {
            return result.treatments;
        }
        return null;
    }

    async loadMeasurementsOfTreatment(patientId, treatmentId) {
        const result = await PatientService.getMeasurementsByTreatmentId(patientId, treatmentId);
        if (result.success) {
            return result.measurements;
        }
        return null;
    }

    async selectTreatment(treatment) {
        this.selectedTreatment = treatment;
        this.measurements = await this.loadMeasurementsOfTreatment(this.patientId, treatment.id)
    }

    togglePopupTreatment() {
        this.isPopupTreatmentVisible = !this.isPopupTreatmentVisible;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
                position: relative;
            }

            .container {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            .patientAndTreatments {
                flex: 1;
            }

            .treatmentHistory {
                max-height: 400px;
                overflow-y: auto;
            }

            .treatmentHistory table, .measurementPanel table {
                border-collapse: collapse;
                width: 100%;
            }

            .treatmentHistory th, td, .measurementPanel th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
                width: 150px;
                position: relative;
            }

            .treatmentHistory th, .measurementPanel th {
                background-color: #f2f2f2;
                position: sticky;
                top: 0; 
                z-index: 1;
            }
            
            .treatmentHistory tr:hover {
                background-color: #f0f0f0;
                cursor: pointer;
            }

            .measurementPanel {
                flex: 0 0 auto;
                margin-left: 100px;
            }
          
            .add-button {
              flex: 3;
              position: absolute;
              top: 0;
              right: 0;
              margin: 1em;
              cursor: pointer;
            }
          
            // Overlay
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
        `;
    }

    render() {
        return html`
            <h2>Patiënt ${this.patient ? this.patient.id : ""}</h2>
            <div class="container">
                <div class="patientAndTreatments">
                    ${this.patient ? html`
                        <h3>Persoonlijke gegevens</h3>
                        <div>
                            <patient-details-table .patient="${this.patient}"></patient-details-table>
                        </div>`
            : ''}
                    <h3>Behandelhistorie</h3>
                    <button @click="${this.togglePopupTreatment}" class="add-button">Voeg behandeling toe</button>
                    <div class="treatmentHistory">
                        ${this.treatments ? html`
                            <div>
                                <table>
                                    <tr>
                                        <th>Begindatum</th>
                                        <th>Einddatum</th>
                                        <th>Conditie</th>
                                    </tr>
                                    ${this.treatments.map(treatment => html`
                                        <tr class="${this.selectedTreatment === treatment ? 'selected' : ''}" @click="${() => this.selectTreatment(treatment)}">
                                            <td>${treatment.startDate}</td>
                                            <td>${treatment.endDate}</td>
                                            <td>${treatment.condition}</td>
                                        </tr>
                                    `)}
                                </table>
                            </div>`
            : html`<p>Geen behandelingen bekend</p>`}
                    </div>
                </div>
                <div class="measurementPanel">
                    <h3>Meethistorie</h3>
                    <table>
                        <tr>
                            <th>Meting</th>
                            <th>Datum</th>
                            <th>Tijd</th>
                            <th>Activiteit</th>
                        </tr>
                        ${this.selectedTreatment ? html`
                        ${this.measurements ? html`
                            ${this.measurements.map(measurement => html`
                                <tr>
                                    <td><a href="#" @click="${() => this.handleMeasurementsClick(measurement.id)}">${measurement.id}</a></td>
                                    <td>${measurement.date}</td>
                                    <td>${measurement.time}</td>
                                    <td>${measurement.activityType}</td>
                                </tr>
                            `)}`
            : html`<tr><td colspan="4">Geen metingen bekend</td></tr>`}
                    ` : html`<tr><td colspan="4">Selecteer een behandeling om de metingen te zien</td></tr>`}
                    </table>
                </div>
            </div>
            <div class="overlay" ?visible="${this.isPopupTreatmentVisible}">
                <div class="popup">
                    <button class="close-button" @click="${this.togglePopupTreatment}">&times;</button>
                    <h3>Voeg een behandeling toe</h3>
                    <form>
                        <div>
                            <label for="startDate">Begindatum:</label>
                            <input type="date" id="startDate" name="startDate" placeholder="startDate" required>
                        </div>
                        <div>
                            <label for="endDate">Einddatum:</label>
                            <input type="date" id="endDate" name="endDate" placeholder="endDate" required>
                        </div>
                        <div>
                            <label for="conditie">Conditie:</label>
                            <input type="text" id="conditie" name="conditie" placeholder="conditie" required>
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

    handleMeasurementsClick(measurementId) {
        const treatmentId = this.selectedTreatment.id;
        Router.go(`/physio-measurement-graphs/patients/${this.patientId}/treatments/${treatmentId}/measurements/${measurementId}`);
    }
}

customElements.define('physio-patient-details', PhysioPatientDetails);
