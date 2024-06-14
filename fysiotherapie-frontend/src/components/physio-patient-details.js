import { html, css, LitElement } from "lit";
import PatientService from "../service/patient-service.js";
import './patient-details-table.js';
import {Router} from "@vaadin/router";

class PhysioPatientDetails extends LitElement {
    static get properties() {
        return {
            patientId: { type: String },
            patient: { type: Object },
            treatments: { type: Array },
            measurements: { type: Array },
            selectedTreatment: { type: Object }
        }
    };

    constructor() {
        super();
        this.patient = null;
        this.treatments = null;
        this.measurements = null;
        this.selectedTreatment = null;
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
                                : html`
                        <p>Geen behandelingen bekend</p>`}
                    </div>
                </div>
                ${this.selectedTreatment ? html`
                            <div class="measurementPanel">
                                <h3>Meethistorie</h3>
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
                                            : html`<tr><td colspan="2">Geen metingen bekend</td></tr>`}
                                </table>
                            </div>`
                        : ''}
            </div>
        `;
    }
    handleMeasurementsClick(measurementId) {
        const treatmentId = this.selectedTreatment.id;
        Router.go(`/physio-measurement-graphs/patients/${this.patientId}/treatments/${treatmentId}/measurements/${measurementId}`);
    }
}

customElements.define('physio-patient-details', PhysioPatientDetails);