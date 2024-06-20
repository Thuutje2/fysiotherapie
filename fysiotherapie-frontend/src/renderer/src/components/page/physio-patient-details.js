import { html, css, LitElement } from "lit";
import PatientService from "../../service/patient-service.js";
import '../table/details-patient-table.js';
import '../table/treatments-table.js';
import '../table/measurements-table.js';
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
            isPopupAddMeasurementVisible: { type: Boolean },
            isUploading: { type: Boolean },
            sortOrder: { type: String },
            compareMode: { type: Boolean },
            selectedMeasurements: { type: Object }
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
        this.isUploading = false;
        this.sortOrder = 'desc';
        this.compareMode = false;
        this.selectedMeasurements = new Set();
    }

    async connectedCallback() {
        super.connectedCallback();
        this.patientId = this.location.params.patientId;
        this.patient = await this.loadPatientDetails(this.patientId);
        this.treatments = await this.loadTreatmentsOfPatient(this.patientId);
        this.sortTreatmentsByStartDate();
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
        const result = await PatientService.getMeasurements(patientId, treatmentId);
        if (result.success) {
            return result.measurements;
        }
        return null;
    }

    toggleCompareMode() {
        this.compareMode = !this.compareMode;
        this.selectedMeasurements.clear();
        this.requestUpdate();
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

    async selectTreatment(treatment) {
        this.selectedTreatment = treatment;
        this.measurements = await this.loadMeasurementsOfTreatment(this.patientId, treatment.id);
        this.compareMode = false;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
                position: relative;
            }
            
            .back-button {
                cursor: pointer;
            }

            .container {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            .patient-and-treatments-tables {
                flex: 1;
            }
            
            .treatment-history {
                max-height: 28vh;
                overflow-y: auto;
            }

            .measurement-history {
                max-height: 65vh;
                overflow-y: auto;
            }
            
            .measurement-table {
                flex: 0 0 auto;
                margin-left: 100px;
            }
            
            .add-treatment-button, .add-measurement-button, .compare-measurement-button, .compare-measurement-finished-button {
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
            
            #error-message {
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

            .loader-overlay[visible] {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .loader[visible] {
                border: 16px solid #f3f3f3;
                border-top: 16px solid rgb(50, 151, 223);
                border-radius: 50%;
                width: 80px;
                height: 80px;
                animation: spin 2s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    }

    render() {
        return html`
        <h2 class="header-container">
            <button class="back-button" @click="${this.goBack}">&#8249;</button>
            Patiënt ${this.patient ? this.patient.id : ""}
        </h2>
        <div class="container">
            <div class="patient-and-treatments-tables">
                ${this.patient ? html`
                    <h3>Persoonlijke gegevens</h3>
                    <div>
                        <details-patient-table .patient="${this.patient}"></details-patient-table>
                    </div>
                    <h3>Behandelhistorie
                        <button class="add-treatment-button" @click="${this.showAddTreatmentOverlay}">Behandeling toevoegen</button>
                    </h3>
                    <div class="treatment-history">
                        <treatments-table   .treatments="${this.treatments}"
                                            .sortOrder="${this.sortOrder}"
                                            @treatment-selected="${this.handleTreatmentSelected}"
                                            @treatment-sorted="${this.sortTreatmentsByStartDate}">
                        </treatments-table>
                    </div>`
            : ''}
            </div>
            <div class="measurement-table">
                <h3>Meethistorie
                    ${this.selectedTreatment ? html`
                        <button class="add-measurement-button" @click="${this.showAddMeasurementOverlay}">Meting toevoegen</button>
                        ${this.measurements && this.measurements.length > 1 ? html`
                            <button class="compare-measurement-button" @click="${this.toggleCompareMode}">
                                ${this.compareMode ? html`Annuleer vergelijking` : html`Vergelijk metingen`}
                            </button>
                        ` : ''}
                    ` : ''}
                </h3>
                <div class="measurement-history">
                    <measurements-table   .measurements="${this.measurements}"
                                          .selectedTreatment="${this.selectedTreatment}"
                                          .selectedMeasurements="${this.selectedMeasurements}"
                                          .compareMode="${this.compareMode}"
                                          @measurement-clicked="${this.handleMeasurementClicked}">
                    </measurements-table>
                </div>
                <button class="compare-measurement-finished-button"
                        @click="${this.handleCompareMeasurements}" ?hidden="${!this.compareMode}">Vergelijk</button>
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
                    <button id="submit-button" type="submit">Opslaan</button>
                    <div id="error-message" style="display: none;">
                        <div></div>
                    </div>
                </form>
            </div>
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
                    <button id="submit-button" type="submit">Opslaan</button>
                    <div id="error-message" style="display: none;">
                </form>
            </div>
        </div>
        <div class="loader-overlay" ?visible="${this.isUploading}">
            <div class="loader" ?visible="${this.isUploading}"></div>
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
        Router.go(`/physio-measurement-graphs/patients/${this.patientId}/treatments/${treatmentId}/measurements/${measurementId}?activity=${encodeURIComponent(activity)}`);
    }

    handleCompareMeasurements(){
        const selectedMeasurements = Array.from(this.selectedMeasurements);
        if (selectedMeasurements.length !== 2){
            return;
        }
        const treatmentId = this.selectedTreatment.id;
        const measurementId1 = selectedMeasurements[0];
        const measurementId2 = selectedMeasurements[1];

        Router.go(`/physio-measurement-compare/patients/${this.patientId}/treatments/${treatmentId}/compare/${measurementId1}/${measurementId2}`);
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
            debugger;
            this.sortOrder = 'asc';
            this.sortTreatmentsByStartDate();
            this.treatments = [...this.treatments, result.treatment];
            this.hideAddTreatmentOverlay();
        }
        else {
            const errorMessage = this.shadowRoot.getElementById("error-message");
            errorMessage.innerText = result.error;
            errorMessage.style.display = "block";
        }
    }

    async handleSubmitMeasurement(event) {
        event.preventDefault();
        this.isUploading = true;

        const formData = new FormData();
        const fileInput = this.shadowRoot.querySelector('#file');
        const file = fileInput.files[0];
        formData.append('file', file);
        const activityInput = this.shadowRoot.querySelector('#activity');
        const activity = activityInput.value;
        formData.append('activity', activity);
        const result = await PatientService.postMeasurement(this.patientId, this.selectedTreatment.id, formData);

        if (result.success === true) {
            this.measurements = [...this.measurements, result.measurement];
            this.isUploading = false;
            this.hideAddMeasurementOverlay();
        }
        else {
            this.isUploading = false;
            const errorMessage = this.shadowRoot.getElementById("error-message");
            errorMessage.innerText = result.error;
            errorMessage.style.display = "block";
        }
    }

    goBack() {
        history.back();
    }
}

customElements.define('physio-patient-details', PhysioPatientDetails);