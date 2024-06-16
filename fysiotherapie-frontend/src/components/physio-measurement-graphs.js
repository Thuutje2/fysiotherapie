import { css, html, LitElement } from "lit";
import PatientService from "../service/patient-service.js";
import { Router } from "@vaadin/router";

class PhysioMeasurementGraphs extends LitElement {
    static get properties() {
        return {
            patientId: { type: String },
            treatmentId: { type: String },
            measurementId: { type: String },
            measurement: { type: Object },
            jointTypes: { type: Array },
            checkedValues: { type: Object }
        };
    }

    constructor() {
        super();
        this.measurement = null;
        this.checkedValues = {};
    }

    async connectedCallback() {
        debugger;
        super.connectedCallback();
        this.patientId = this.location.params.patientId;
        this.treatmentId = this.location.params.treatmentId;
        this.measurementId = this.location.params.measurementId;

        this.requestUpdate();
        this.measurement = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId);
        this.jointTypes = this.measurement.map(jointData => jointData.jointType);
    }

    async loadMeasurement(patientId, treatmentId, measurementId) {
        const result = await PatientService.getMeasurementById(patientId, treatmentId, measurementId);
        if (result.success) {
            return result.measurement;
        }
        return null;
    }

    handleCheckboxChange(event) {
        const { id, checked } = event.target;
        this.checkedValues = { ...this.checkedValues, [id]: checked };
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
                position: relative; 
            }

            .checkboxContainer {
                border: 1px solid #ccc; 
                padding: 10px; 
            }

            .checkbox {
                margin-right: 10px;
            }
            
            .loader {
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
        if (!this.measurement) {
            return html`
                <div class="container">
                    <h2>Meting ${this.measurementId}</h2>
                    <div class="loader"></div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <h2>Meting ${this.measurementId}</h2>
                <div class="checkboxContainer">
                    ${this.jointTypes.map(jointType => html`
                        <input
                                class="checkbox"
                                type="checkbox"
                                id="${jointType}"
                                name="${jointType}"
                                value="${jointType}"
                                @change="${this.handleCheckboxChange}"
                                ?checked="${this.checkedValues[jointType]}"
                        >
                        <label for="${jointType}">${jointType}</label><br>
                    `)}
                </div>
            </div>
        `;
    }


}
customElements.define('physio-measurement-graphs', PhysioMeasurementGraphs);