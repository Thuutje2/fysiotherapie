import { css, html, LitElement } from "lit";
import PatientService from "../../service/patient-service.js";
import "../graph/measurement-graphs.js";

class PatientMeasurementGraphs extends LitElement {
    static get properties() {
        return {
            patientId: { type: String },
            treatmentId: { type: String },
            measurementId: { type: String },
            activity: { type: String },
            renderComplete: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.renderComplete = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadPatientDetails();
        this.treatmentId = this.location.params.treatmentId;
        this.measurementId = this.location.params.measurementId;
        const urlParams = new URLSearchParams(window.location.search);
        this.activity = urlParams.get("activity");
        this.renderComplete = true;
    }

    async loadPatientDetails() {
        const result = await PatientService.getPatientDetails();
        if (result.success) {
            this.patientId = String(result.patient.id);
        } else {
            this.error = result.error;
        }
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                padding: 1em;
                position: relative;
            }

            .back-button {
                cursor: pointer;
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
        if (!this.renderComplete) {
            return html``;
        }

        return html`
            <h2>
                <button class="back-button" @click="${this.goBack}">&#8249;</button>
                Meting ${this.measurementId}
            </h2>
            <p><b>Activiteit</b>: ${this.activity}</p>
            <measurement-graphs 
                .patientId="${this.patientId}"
                .treatmentId="${this.treatmentId}"
                .measurementId="${this.measurementId}">
            </measurement-graphs>
        `;
    }

    goBack() {
        history.back();
    }
}

customElements.define('patient-measurement-graphs', PatientMeasurementGraphs);