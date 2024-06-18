import { css, html, LitElement } from "lit";
import PatientService from "../../service/patient-service.js";
import "../graph/measurement-graphs.js";

class PhysioMeasurementGraphs extends LitElement {
    static get properties() {
        return {
            patientId: { type: String },
            treatmentId: { type: String },
            measurementId: { type: String },
            measurement: { type: Object },
            activity: { type: String }
        };
    }

    constructor() {
        super();
        this.measurement = null;
    }

    async connectedCallback() {
        debugger;
        super.connectedCallback();
        this.patientId = this.location.params.patientId;
        this.treatmentId = this.location.params.treatmentId;
        this.measurementId = this.location.params.measurementId;
        const urlParams = new URLSearchParams(window.location.search);
        this.activity = urlParams.get("activity");
        this.measurement = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId);
    }

    async loadMeasurement(patientId, treatmentId, measurementId) {
        debugger;
        const result = await PatientService.getMeasurementForPhysio(patientId, treatmentId, measurementId);
        if (result.success) {
            return result.measurement;
        }
        return null;
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                padding: 1em;
                position: relative;
            }
            
            p {
                margin: 2px;
            }

            .loader {
                margin-top: 10px;
                width: 20px;
                aspect-ratio: 4;
                background: radial-gradient(circle closest-side,#000 90%,#0000) 0/calc(100%/3) 100% space;
                clip-path: inset(0 100% 0 0);
                animation: l1 1s steps(4) infinite;
            }
            @keyframes l1 {to{clip-path: inset(0 -34% 0 0)}}
        `;
    }

    render() {
        return html`
        <h2>Meting ${this.measurementId}</h2>
        <p><b>Patiëntnummer</b>: ${this.patientId}</p>
        <p><b>Activiteit</b>: ${this.activity}</p>
        ${!this.measurement ? html`
            <div class="loader"></div>
        ` : html`
            <measurement-graphs .measurement="${this.measurement}"></measurement-graphs>
        `}
    `;
    }
}
customElements.define('physio-measurement-graphs', PhysioMeasurementGraphs);