import { css, html, LitElement } from "lit";
import PatientService from "../service/patient-service.js";
import { Router } from "@vaadin/router";
import Chart from 'chart.js/auto';

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
        this.chart = null;
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
        if (checked) {
            this.renderChart(id);
        } else {
            this.destroyChart();
        }
    }

    destroyChart() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    getAllSecondsAndPositions(jointType) {
        if (!Array.isArray(this.measurement)) {
            console.error("Measurements data is not available or is not an array.");
            return { seconds: [], positions: [] };
        }

        const data = this.measurement.find(item => item.jointType === jointType);
        if (data) {
            const seconds = Object.keys(data.secondsToPosition).map(parseFloat);
            const positions = Object.values(data.secondsToPosition).map(parseFloat);
            return { seconds, positions };
        }
        return { seconds: [], positions: [] };
    }

    renderChart(jointType) {
        const ctx = this.shadowRoot.getElementById('chart').getContext('2d');
        const { seconds, positions } = this.getAllSecondsAndPositions(jointType);

        if (seconds.length === 0 || positions.length === 0) {
            console.error(`No data available for jointType: ${jointType}`);
            return;
        }

        const dataset = {
            label: jointType,
            data: seconds.map((second, index) => ({ x: second, y: positions[index] })),
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            fill: false
        };

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [dataset]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Seconds'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Position'
                        }
                    }
                }
            }
        });
    }



    static get styles() {
        return css`
            :host {
              display: flex;
              flex-direction: column;
              padding: 1em;
              position: relative; 
            }
          
            .container {
              display: flex;
              flex-direction: row;
              align-items: flex-start;
            }

            .checkboxContainer {
              border: 1px solid #ccc; 
              padding: 10px; 
              margin-right: 20px;
              flex: 1;
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
          
            canvas {
              max-width: 85%;
              margin-top: 20px;
              flex: 2;
              margin-top: 20px;
            }
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
                <div class="checkboxContainer">
                    <h2>Meting ${this.measurementId}</h2>
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
                <canvas id="chart"></canvas>
            </div>
        `;
    }


}
customElements.define('physio-measurement-graphs', PhysioMeasurementGraphs);