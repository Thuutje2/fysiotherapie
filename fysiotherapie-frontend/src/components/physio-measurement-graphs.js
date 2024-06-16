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
            jointPairs: { type: Object },
        };
    }

    constructor() {
        super();
        this.measurement = null;
        this.jointPairs = {};
    }

    async connectedCallback() {
        super.connectedCallback();
        this.patientId = this.location.params.patientId;
        this.treatmentId = this.location.params.treatmentId;
        this.measurementId = this.location.params.measurementId;

        this.requestUpdate();
        this.measurement = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId);
        const jointTypes = this.measurement.map(jointData => jointData.jointType);
        this.jointPairs = this.groupJointTypes(jointTypes);
    }

    groupJointTypes(jointTypes) {
        debugger;
        const groupedJoints = {};
        jointTypes.forEach(joint => {
            const key = joint.replace(/\b(left|right)\b/i, "").trim();
            if (!groupedJoints[key]) {
                groupedJoints[key] = [];
            }
            groupedJoints[key].push(joint);
        });
        return groupedJoints;
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

            .checkbox-container {
                padding: 10px;
                display: flex;
                flex-wrap: wrap;
            }

            .joint-pairs-checkboxes {
                display: flex;
                flex-direction: column;
                margin-bottom: 10px;
                margin-right: 5px;
                min-width: 150px;
                flex-grow: 1; /
            }

            .joint-option {
                display: flex;
                min-width: 100px;
                flex-grow: 1;
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
                <div class="checkbox-container">
                    ${Object.entries(this.jointPairs).map(([key, value]) => html`
                        ${value.length === 1 ? html`
                            <div class="joint-option">
                                <input class="checkbox" type="checkbox" id="${value[0]}" name="${value[0]}" value="${value[0]}">
                                <label class="joint-name" for="${value[0]}">${value[0]}</label>
                            </div>
                        ` : html`
                            <div class="joint-pairs-checkboxes">
                                ${value.map(joint => html`
                                    <div class="joint-option">
                                        <input class="checkbox" type="checkbox" id="${joint}" name="${joint}" value="${joint}"
                                        >
                                        <label class="joint-name" for="${joint}">${joint}</label>
                                    </div>
                                `)}
                            </div>
                        `}
                    `)}
                </div>
            </div>
        `;
    }
}
customElements.define('physio-measurement-graphs', PhysioMeasurementGraphs);