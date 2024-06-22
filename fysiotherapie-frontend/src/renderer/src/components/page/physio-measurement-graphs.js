import { css, html, LitElement } from "lit";
import PatientService from "../../service/patient-service.js";
import "../graph/measurement-graphs.js";
import "../graph/measurement-compare-graphs.js";

class PhysioMeasurementGraphs extends LitElement {
    static get properties() {
        return {
            patientId: { type: String },
            treatmentId: { type: String },
            measurementId: { type: String },
            measurement: { type: Object },
            activity: { type: String },
            compareMode: { type: Boolean },
            measurementId1: { type: String },
            measurementId2: { type: String },
            measurement1: { type: Object },
            measurement2: { type: Object }
        };
    }

    constructor() {
        super();
        this.measurement = null;
        this.compareMode = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.patientId = this.location.params.patientId;
        this.treatmentId = this.location.params.treatmentId;

        const urlParams = new URLSearchParams(window.location.search);
        this.activity = urlParams.get("activity");

        if (urlParams.get("compare") !== null) {
            this.measurementId1 = this.location.params.measurementId;
            this.measurementId2 = urlParams.get("compare");
            this.compareMode = true;
            this.measurement1 = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId1);
            this.measurement2 = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId2);
            return;
        }

        this.measurementId = this.location.params.measurementId;
        this.measurement = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId);
    }

    async loadMeasurement(patientId, treatmentId, measurementId) {
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
        return html`
            <div class="header">
                <button class="back-button" @click="${this.goBack}">&#8249;</button>
                <h2>
                    ${this.compareMode
                            ? `Vergelijking van metingen ${this.measurementId1} en ${this.measurementId2}`
                            : `Meting ${this.measurementId}`}
                </h2>
            </div>
        <p><b>Patiëntnummer</b>: ${this.patientId}</p>
        ${this.compareMode
            ? html`
                <div>
                    ${!this.measurement1 || !this.measurement2 ? html`
                        <div class="loader"></div>
                    ` : html`
                        <measurement-compare-graphs
                            .measurement1="${this.measurement1}"
                            .measurement2="${this.measurement2}"
                            .measurementId1="${this.measurementId1}"
                            .measurementId2="${this.measurementId2}"
                        ></measurement-compare-graphs>
                    `}
                </div>
            `
            : html`
                ${!this.measurement ? html`
                    <p><b>Activiteit</b>: ${this.activity}</p>
                    <div class="loader"></div>
                ` : html`
                    <measurement-graphs .measurement="${this.measurement}"></measurement-graphs>
                `}
            `
        }
    `;
    }


    goBack() {
        history.back();
    }
}
customElements.define('physio-measurement-graphs', PhysioMeasurementGraphs);