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
            renderComplete: { type: Boolean },

            compareMode: { type: Boolean },
            measurementId1: { type: String },
            measurementId2: { type: String },
            measurement1: { type: Object },
            measurement2: { type: Object }
        };
    }

    constructor() {
        super();
        this.renderComplete = false;
        this.compareMode = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadPatientDetails();
        this.treatmentId = this.location.params.treatmentId;
        const urlParams = new URLSearchParams(window.location.search);
        this.activity = urlParams.get("activity");
        this.renderComplete = true;

        if (urlParams.get("compare") !== null) {
            this.measurementId1 = this.location.params.measurementId;
            this.measurementId2 = urlParams.get("compare");
            this.compareMode = true;
            return;
        }
        this.measurementId = this.location.params.measurementId;
    }

    async loadPatientDetails() {
        const result = await PatientService.getPatientDetails();
        if (result.success) {
            this.patientId = result.data.id;
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

            .header {
                display: flex;
                align-items: center;
            }

            .back-button {
                cursor: pointer;
                margin-right: 10px;
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
            <div class="header">
                <button class="back-button" @click="${this.goBack}">&#8249;</button>
                <h2>
                    ${this.compareMode
                            ? `Vergelijking van metingen ${this.measurementId1} en ${this.measurementId2}`
                            : `Meting ${this.measurementId}`}
                </h2>
            </div>
            <p><b>Activiteit</b>: ${this.activity}</p>
            ${this.compareMode
                    ? html`
                        <measurement-compare-graphs
                                .patientId="${this.patientId}"
                                .treatmentId="${this.treatmentId}"
                                .measurementId1="${this.measurementId1}"
                                .measurementId2="${this.measurementId2}"
                        ></measurement-compare-graphs>
            `
                    : html`
                        <p><b>Activiteit</b>: ${this.activity}</p>
                        <measurement-graphs
                                .patientId="${this.patientId}"
                                .treatmentId="${this.treatmentId}"
                                .measurementId="${this.measurementId}">
                        </measurement-graphs>
            `
            }
        `;
    }

    goBack() {
        history.back();
    }
}

customElements.define('patient-measurement-graphs', PatientMeasurementGraphs);