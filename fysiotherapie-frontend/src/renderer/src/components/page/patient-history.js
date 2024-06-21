import {css, html, LitElement} from "lit";
import {Router} from "@vaadin/router";
import PatientService from "../../service/patient-service.js";

class PatientHistory extends LitElement {
    static properties = {
        patient: { type: Object },
        treatments: { type: Array },
        measurements: { type: Array },
        selectedTreatment: { type: Object },
        error: { type: String },
        sortOrder: { type: String }
    };

    constructor() {
        super();
        this.patient = null;
        this.treatments = null;
        this.measurements = null;
        this.selectedTreatment = null;
        this.error = "";
        this.sortOrder = 'desc';
    }

    async connectedCallback() {
        super.connectedCallback()
        await this.loadPatientDetails();
        this.patientId = this.patient.id;
        this.treatments = await this.loadTreatmentsOfPatient(this.patientId);
        this.sortTreatmentsByStartDate();
    }

    async loadPatientDetails() {
        const result = await PatientService.getPatientDetails();
        if (result.success) {
            this.patient = result.data;
        } else {
            this.error = result.error;
        }
    }

    async loadTreatmentsOfPatient(patientId) {
        const result = await PatientService.getTreatmentsByPatientId(patientId);
        if (result.success) {
            return result.data;
        }
        return null;
    }

    async loadMeasurementsOfTreatment(patientId, treatmentId) {
        const result = await PatientService.getMeasurements(patientId, treatmentId);
        if (result.success) {
            return result.data;
        }
        return null;
    }

    sortTreatmentsByStartDate() {
        const sortedTreatments = [...this.treatments];
        if (this.sortOrder === 'asc') {
            sortedTreatments.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            this.sortOrder = 'desc';
        } else {
            sortedTreatments.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            this.sortOrder = 'asc';
        }
        this.treatments = sortedTreatments;
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
                                                .sortOrder="${this.sortOrder}"
                                                @treatment-selected="${this.handleTreatmentSelected}"
                                                @treatment-sorted="${this.sortTreatmentsByStartDate}">
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