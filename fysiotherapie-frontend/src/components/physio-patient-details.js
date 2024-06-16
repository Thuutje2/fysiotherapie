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
            isPopupAddTreatmentVisible: { type: Boolean },
            isPopupAddMeasurementVisible: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.patient = null;
        this.treatments = null;
        this.measurements = null;
        this.selectedTreatment = null;
        this.isPopupAddTreatmentVisible = false;
        this.isPopupAddMeasurementVisible = false;
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
        this.measurements = await this.loadMeasurementsOfTreatment(this.patientId, treatment.id);
    }

    showAddTreatmentOverlay(container) {
        this.isPopupAddTreatmentVisible = true;
    }

    hideAddTreatmentOverlay() {
        this.isPopupAddTreatmentVisible = false;
    }

    showAddMeasurementOverlay() {
        this.isPopupAddMeasurementVisible = true;
    }

    hideAddMeasurementOverlay() {
        this.isPopupAddMeasurementVisible = false;
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

            .patient-and-treatments {
                flex: 1;
            }

            .treatment-history {
                max-height: 400px;
                overflow-y: auto;
            }

            .treatment-history table, .measurement-panel table {
                border-collapse: collapse;
                width: 100%;
            }

            .treatment-history th, td, .measurement-panel th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
                width: 150px;
                position: relative;
            }

            .treatment-history th, .measurement-panel th {
                background-color: #f2f2f2;
                position: sticky;
                top: 0; 
                z-index: 1;
            }
            .treatment-history tr:hover {
                background: rgb(50, 151, 223, 0.2);
                cursor: pointer;
            }

            .measurement-panel {
                flex: 0 0 auto;
                margin-left: 100px;
            }
            
            .add-treatment-button, .add-measurement-button {
                float: right;
            }

            .add-treatment-button:hover, .add-measurement-button:hover {
                cursor: pointer;
            }

            .add-treatment-overlay, .add-measurement-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                justify-content: center;
                align-items: center;
                z-index: 1000;
                margin: auto;
            }

            .add-treatment-overlay[visible], .add-measurement-overlay[visible] {
                display: flex;
            }

            .add-treatment-overlay form, .add-measurement-overlay form {
                display: flex;
                flex-direction: column;
            }

            .add-treatment-overlay form label, .add-measurement-overlay form label {
                display: inline-block;
                width: 120px;
                margin-right: 10px;
            }
            
            .add-treatment-overlay form input, .add-measurement-overlay form input {
                margin-bottom: 1em;
                padding: 0.5em;
                border: 1px solid #ccc;
                border-radius: 3px;
                width: calc(100% - 16px);
            }
            
            .add-treatment-overlay form button, .add-measurement-overlay form button {
                padding: 0.5em;
                border: none;
                background: rgb(50, 151, 223);
                color: white;
                border-radius: 3px;
                cursor: pointer;
            }

            .add-treatment-overlay form button:hover, .add-measurement-overlay form button:hover {
                background-color: rgb(30, 91, 158);
            }

            .add-treatment, .add-measurement {
                background-color: white;
                padding: 2em;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
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
        `;
    }

    render() {
        return html`
        <h2>Patiënt ${this.patient ? this.patient.id : ""}</h2>
        <div class="container">
            <div class="patient-and-treatments">
                ${this.patient ? html`
                    <h3>Persoonlijke gegevens</h3>
                    <div>
                        <patient-details-table .patient="${this.patient}"></patient-details-table>
                    </div>`
            : ''}
                <h3>Behandelhistorie
                    <button class="add-treatment-button" @click="${this.showAddTreatmentOverlay}">Behandeling toevoegen</button>
                </h3>
                <div class="treatment-history">
                    <div>
                        <table>
                            <tr>
                                <th>Begindatum</th>
                                <th>Einddatum</th>
                                <th>Conditie</th>
                            </tr>
                            ${this.treatments !== null ? html`
                                ${this.treatments.map(treatment => html`
                                    <tr class="${this.selectedTreatment === treatment ? 'selected' : ''}" @click="${() => this.selectTreatment(treatment)}">
                                        <td>${treatment.startDate}</td>
                                        <td>${treatment.endDate}</td>
                                        <td>${treatment.condition}</td>
                                    </tr>
                                `)}`
            : html`
                                <tr><td colspan="3">Geen behandelingen bekend</td></tr>
                            `}
                        </table>
                    </div>
                </div>
            </div>
            <div class="add-treatment-overlay" ?visible="${this.isPopupAddTreatmentVisible}" @click="${this.handleAddTreatmentOverlayClick}">
                <div class="add-treatment">
                    <button class="close-button" @click="${this.hideAddTreatmentOverlay}">&times;</button>
                    <h3>Voeg een nieuwe behandeling toe</h3>
                    <form @submit="${this.handleSubmitTreatment}">
                        <div>
                            <label for="startDate">Begindatum:</label>
                            <input type="date" id="startDate" name="startDate" placeholder="Begindatum" required>
                        </div>
                        <div>
                            <label for="endDate">Einddatum:</label>
                            <input type="date" id="endDate" name="endDate" placeholder="Einddatum" required>
                        </div>
                        <div>
                            <label for="condition">Conditie:</label>
                            <input type="text" id="condition" name="condition" placeholder="Conditie" required>
                        </div>
                        <button id="submitButton" type="submit">Opslaan</button>
                        <div id="errorMessage" style="display: none;">
                            <div></div>
                        </div>
                    </form>
                </div>
            </div>
            
            
            <div class="measurement-panel">
                <h3>Meethistorie
                    ${this.selectedTreatment ? html`
                            <button class="add-measurement-button" @click="${this.showAddMeasurementOverlay}">Meting toevoegen</button>`
                            : ''}
                </h3>
                ${this.selectedTreatment ? html`
                    <table>
                        <tr>
                            <th>Meting</th>
                            <th>Datum</th>
                            <th>Tijd</th>
                            <th>Activiteit</th>
                        </tr>
                        ${this.measurements ? html`
                            ${this.measurements.map(measurement => html`
                                <tr>
                                    <td><a href="#" @click="${() => this.handleMeasurementsClick(measurement.id)}">${measurement.id}</a></td>
                                    <td>${measurement.date}</td>
                                    <td>${measurement.time}</td>
                                    <td>${measurement.activityType}</td>
                                </tr>
                            `)}`
                : html`
                                <tr><td colspan="4">Geen metingen bekend</td></tr>
                            `}
                    </table>`
            : html`<p>Selecteer eerst een behandeling</p>`
        }
            </div>
            <div class="add-measurement-overlay" ?visible="${this.isPopupAddMeasurementVisible}" @click="${this.handleAddMeasurementOverlayClick}">
                <div class="add-measurement">
                    <button class="close-button" @click="${this.hideAddMeasurementOverlay}">&times;</button>
                    <h3>Voeg een nieuwe meting toe</h3>
                    <form @submit="${this.handleSubmitMeasurement}">
                        <div>
                            <label for="activity">Activiteit:</label>
                            <input type="text" id="activity" name="activity" placeholder="Lopen" required>
                        </div>
                        <div>
                            <label for="file">Bestand:</label>
                            <input type="file" id="file" name="file" @change="${this.handleFileSelect}" required>
                        </div>
                        <button id="submitButton" type="submit">Opslaan</button>
                        <div id="errorMessage" style="display: none;">
                            <div></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    }

    handleAddTreatmentOverlayClick(event) {
        if (event.target.classList.contains('add-treatment-overlay')) {
            this.hideAddTreatmentOverlay();
        }
    }

    handleAddMeasurementOverlayClick(event) {
        if (event.target.classList.contains('add-measurement-overlay')) {
            this.hideAddMeasurementOverlay();
        }
    }

    async handleSubmitTreatment(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const treatment = Object.fromEntries(formData.entries());
        const result = await PatientService.postTreatment(this.patientId, treatment);

        if (result.success === true) {
            this.treatments = [...this.treatments, result.treatment];
            this.hideAddTreatmentOverlay();
        }
        else {
            const errorMessage = this.shadowRoot.getElementById("errorMessage");
            errorMessage.innerText = result.error;
            errorMessage.style.display = "block";
        }
    }

    async handleSubmitMeasurement(event) {
        event.preventDefault();
    }

    handleMeasurementsClick(measurementId) {
        const treatmentId = this.selectedTreatment.id;
        Router.go(`/physio-measurement-graphs/patients/${this.patientId}/treatments/${treatmentId}/measurements/${measurementId}`);
    }
}

customElements.define('physio-patient-details', PhysioPatientDetails);