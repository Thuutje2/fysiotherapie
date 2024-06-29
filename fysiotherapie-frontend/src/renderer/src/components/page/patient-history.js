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
        sortOrder: { type: String },
        compareMode: { type: Boolean },
        selectedMeasurements: { type: Object }
    };

    constructor() {
        super();
        this.patient = null;
        this.treatments = null;
        this.measurements = null;
        this.selectedTreatment = null;
        this.error = "";
        this.sortOrder = 'desc';
        this.compareMode = false;
        this.selectedMeasurements = new Set();
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

    toggleCompareMode() {
        this.compareMode = !this.compareMode;
        this.selectedMeasurements.clear();
        this.requestUpdate();
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

            .compare-measurement-button, .compare-measurement-finished-button {
                float: right;
                background-color: rgb(50, 151, 223);
                color: white;
                border: none;
                border-radius: 3px;
                padding: 0.5em 1em;
                cursor: pointer;
            }

            .compare-measurement-button {
                margin-right: 5px;
            }

            .compare-measurement-finished-button {
                margin-top: 5px;
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
                    <h3>Meethistorie
                        ${this.measurements && this.measurements.length > 1 ? html`
                            <button class="compare-measurement-button" @click="${this.toggleCompareMode}">
                                ${this.compareMode ? html`Annuleer vergelijking` : html`Vergelijk metingen`}
                            </button>
                        ` : ''}
                    </h3>
                    <div class="measurements-table">
                        <measurements-table   .measurements="${this.measurements}"
                                              .selectedTreatment="${this.selectedTreatment}"
                                              .selectedMeasurements="${this.selectedMeasurements}"
                                              .compareMode="${this.compareMode}"
                                              @measurement-clicked="${this.handleMeasurementClicked}">
                        </measurements-table>
                    </div>
                    <button class="compare-measurement-finished-button"
                            @click="${this.handleCompareMeasurements}" ?hidden="${!this.compareMode}">Vergelijk
                    </button>
                </div>
            </div>
        `;
    }

    async handleTreatmentSelected(event) {
        this.selectedTreatment = event.detail.treatment;
        this.measurements = await this.loadMeasurementsOfTreatment(this.patientId, this.selectedTreatment.id);
        this.compareMode = false;
    }

    handleMeasurementClicked(event) {
        const { id: measurementId, activity } = event.detail.measurement;
        const treatmentId = this.selectedTreatment.id;
        Router.go(`/patient-measurement-graphs/treatments/${treatmentId}/measurements/${measurementId}?activity=${encodeURIComponent(activity)}`);
    }

    handleCompareMeasurements(){
        const selectedMeasurements = Array.from(this.selectedMeasurements);
        if (selectedMeasurements.length !== 2){
            return;
        }
        const treatmentId = this.selectedTreatment.id;
        const measurementId1 = selectedMeasurements[0];
        const measurementId2 = selectedMeasurements[1];

        Router.go(`/patient-measurement-graphs/treatments/${treatmentId}/measurements/${measurementId1}?compare=${encodeURIComponent(measurementId2)}`);
    }
}

customElements.define('patient-history', PatientHistory);