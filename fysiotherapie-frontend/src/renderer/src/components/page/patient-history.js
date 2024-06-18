import {css, html, LitElement} from "lit";
import {Router} from "@vaadin/router";
import PatientService from "../../service/patient-service.js";

class PatientHistory extends LitElement {
    static properties = {
        patient: { type: Object },
        treatments: { type: Array },
        measurements: { type: Array },
        selectedTreatment: { type: Object },
        error: { type: String }
    };

    constructor() {
        super();
        this.patient = null;
        this.treatments = null;
        this.measurements = null;
        this.selectedTreatment = null;
        this.error = "";
    }

    async connectedCallback() {
        super.connectedCallback()
        await this.loadPatientDetails();
        this.patientId = this.patient.id;
        this.treatments = await this.loadTreatmentsOfPatient(this.patientId);
    }

    async loadPatientDetails() {
        const result = await PatientService.getPatientDetails();
        if (result.success) {
            this.patient = result.patient;
        } else {
            this.error = result.error;
        }
    }

    async loadTreatmentsOfPatient(patientId) {
        const result = await PatientService.getTreatmentsByPatientId(patientId);
        if (result.success) {
            return result.treatments;
        }
        return null;
    }

    async loadMeasurementsOfTreatment(patientId, treatmentId) {
        const result = await PatientService.getMeasurements(patientId, treatmentId);
        if (result.success) {
            return result.measurements;
        }
        return null;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
            }

            .container {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            .treatments-table-container {
                display: flex; 
            }

            .measurements-history {
                flex: 0 0 auto;
                margin-left: 100px;
            }

            .treatments-table, .measurements-table {
                max-height: 65vh;
                overflow-y: auto;
            }
        `;
    }

    render() {
        if (this.error) {
            return html`<p>${this.error}</p>`;
        }
        if (!this.patient) {
            return html`<p>Aan het laden...</p>`;
        }
        return html`
            <h2>Uw historie</h2>
            <div class="container">
                <div class="treatments-table-container">
                    <div class="treatments-history">
                        <h3>Behandelhistorie</h3>
                        <div class="treatments-table">
                            <treatments-table   .treatments="${this.treatments}"
                                                @treatment-selected="${this.handleTreatmentSelected}">
                            </treatments-table>
                        </div>
                    </div>
                </div>
                <div class="measurements-history">
                    <h3>Meethistorie</h3>
                    <div class="measurements-table">
                        <measurements-table   .measurements="${this.measurements}"
                                              .selectedTreatment="${this.selectedTreatment}"
                                              @measurement-clicked="${this.handleMeasurementClicked}">
                        </measurements-table>
                    </div>
                </div>
            </div>
        `;
    }

    async handleTreatmentSelected(event) {
        this.selectedTreatment = event.detail.treatment;
        this.measurements = await this.loadMeasurementsOfTreatment(this.patientId, this.selectedTreatment.id);
    }

    handleMeasurementClicked(event) {
        const { id: measurementId, activity } = event.detail.measurement;
        const treatmentId = this.selectedTreatment.id;
        Router.go(`/patient-measurement-graphs/treatments/${treatmentId}/measurements/${measurementId}?activity=${encodeURIComponent(activity)}`);
    }
}

customElements.define('patient-history', PatientHistory);