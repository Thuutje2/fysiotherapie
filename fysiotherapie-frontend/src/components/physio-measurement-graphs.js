import { css, html, LitElement } from "lit";
import PatientService from "../service/patient-service.js";
import { Router } from "@vaadin/router";

class PhysioMeasurementGraphs extends LitElement {
    static get properties() {
        return {
            patientId: { type: String },
            treatmentId: { type: String },
            measurementId: { type: String },
            measurement: { type: Object }
        };
    }

    constructor() {
        super();
        this.measurement = null;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.patientId = this.location.params.patientId;
        this.treatmentId = this.location.params.treatmentId;
        this.measurementId = this.location.params.measurementId;

        this.measurement = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId);
    }

    async loadMeasurement(patientId, treatmentId, measurementId) {
        const result = await PatientService.getMeasurementById(patientId, treatmentId, measurementId);
        if (result.success) {
            return result.measurement;
        }
        return null;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
                position: relative; 
            }
        `;
    }

    render() {
        return html`
            <div class="container">
                <h2>Meting ${this.measurementId}</h2>
        `;
    }


}
customElements.define('physio-measurement-graphs', PhysioMeasurementGraphs);