import { css, html, LitElement } from "lit";
import PatientService from "../service/patient-service.js";
import { Router } from "@vaadin/router";
import Chart from 'chart.js/auto';

class PhysioMeasurementCompare extends LitElement {
    static get properties() {
        return {
            patientId: {type: String},
            treatmentId: {type: String},
            measurementId1: {type: String},
            measurementId2: {type: String},
            measurement1: {type: Object},
            measurement2: {type: Object},
            jointTypes: {type: Array},
            checkedValues: {type: Object}
        };
    }

    constructor() {
        super();
        this.measurement1 = null;
        this.measurement2 = null;
        this.checkedValues = {};
        this.chart1 = null;
        this.chart2 = null;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.patientId = this.location.params.patientId;
        this.treatmentId = this.location.params.treatmentId;
        this.measurementId1 = this.location.params.measurementId1;
        this.measurementId2 = this.location.params.measurementId2;

        this.requestUpdate();
        this.measurement1 = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId1);
        console.log('Loaded measurement1:', this.measurement1);
        this.measurement2 = await this.loadMeasurement(this.patientId, this.treatmentId, this.measurementId2);
        console.log('Loaded measurement2:', this.measurement2);
        this.jointTypes = this.measurement1.map(jointData => jointData.jointType);
        console.log('Joint types:', this.jointTypes);
    }

    async loadMeasurement(patientId, treatmentId, measurementId) {
        const result = await PatientService.getMeasurementById(patientId, treatmentId, measurementId);
        console.log('Result for measurementId', measurementId, ':', result);
        if (result.success) {
            console.log(result.measurement)
            return result.measurement;
        }
        return null;
    }

    handleCheckboxChange(event) {
        const {id, checked} = event.target;
        const checkedCount = Object.values(this.checkedValues).filter(val => val).length;

        if (checked && checkedCount >= 2) {
            event.target.checked = false;
            return;
        }

        this.checkedValues = {...this.checkedValues, [id]: checked};
        this.renderChart(); // Roep renderChart aan om alle geselecteerde datasets te tonen
    }

    destroyChart() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    getSecondsAndPositions(measurement, jointType) {
        console.log('Getting seconds and positions for jointType:', jointType);
        if (!Array.isArray(measurement)) {
            console.error("Measurement data is not available or is not an array.");
            return {seconds: [], positions: []};
        }

        const data = measurement.find(item => item.jointType === jointType);
        if (data) {
            const seconds = Object.keys(data.secondsToPosition).map(parseFloat);
            const positions = Object.values(data.secondsToPosition).map(parseFloat);
            console.log('Seconds:', seconds, 'Positions:', positions);
            return {seconds, positions};
        }
        return {seconds: [], positions: []};
    }

    renderChart() {
        const ctx = this.shadowRoot.getElementById('chart').getContext('2d');

        const datasets1 = Object.keys(this.checkedValues)
            .filter(jointType => this.checkedValues[jointType])
            .map(jointType => {
                const {seconds, positions} = this.getSecondsAndPositions(this.measurement1, jointType);
                return {
                    label: `${jointType} - Meting ${this.measurementId1}`,
                    data: seconds.map((second, index) => ({x: second, y: positions[index]})),
                    borderColor: this.getColorForJointType(jointType),
                    borderWidth: 1,
                    fill: false
                };
            });

        const datasets2 = Object.keys(this.checkedValues)
            .filter(jointType => this.checkedValues[jointType])
            .map(jointType => {
                const {seconds, positions} = this.getSecondsAndPositions(this.measurement2, jointType);
                return {
                    label: `${jointType} - Meting ${this.measurementId2}`,
                    data: seconds.map((second, index) => ({x: second, y: positions[index]})),
                    borderColor: this.getColorForJointType(jointType, true),
                    borderWidth: 1,
                    fill: false
                };
            });

        const combinedDatasets = [...datasets1, ...datasets2];

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: combinedDatasets
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



    getColorForJointType(jointType, isSecondChart = false) {
        const colors = {
            // Define colors for each jointType
        };
        const selectedJointTypes = Object.keys(this.checkedValues).filter(jt => this.checkedValues[jt]);
        const index = selectedJointTypes.indexOf(jointType);
        if (index !== -1) {
            const defaultColors = isSecondChart ? ['rgb(192, 75, 75)', 'rgb(75, 75, 192)'] : ['rgb(75, 192, 192)', 'rgb(192, 75, 75)'];
            return defaultColors[index % defaultColors.length];
        } else {
            return 'rgb(75, 75, 192)';
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

            .container {
                display: flex;
                flex-direction: row; 
                align-items: flex-start;
                justify-content: space-between; 
                flex-wrap: wrap; 
            }

            .checkboxContainer {
                border: 1px solid #ccc;
                padding: 10px;
                margin-right: 20px;
                width: 150px;
                flex-shrink: 0; 
            }

            .checkbox {
                margin-right: 10px;
            }

            .loader {
                width: 20px;
                aspect-ratio: 4;
                background: radial-gradient(circle closest-side, #000 90%, #0000) 0/calc(100% / 3) 100% space;
                clip-path: inset(0 100% 0 0);
                animation: l1 1s steps(4) infinite;
            }

            @keyframes l1 {
                to {
                    clip-path: inset(0 -34% 0 0)
                }
            }

            .chartContainer {
                display: flex;
                flex-direction: column;
                flex-grow: 1; /* Laat de grafiekcontainer meegroeien met beschikbare ruimte */
                margin-left: 20px; /* Voeg wat ruimte toe tussen checkboxContainer en charts */
            }

            canvas {
                width: 100%; /* Laat de grafieken de volledige breedte van de container gebruiken */
                height: 500px; /* Pas de hoogte aan naar wens */
                margin-top: 20px;
            }

            @media (min-width: 768px) {
                .container {
                    flex-wrap: nowrap; /* Voorkom dat items op een nieuwe rij gaan bij grotere schermen */
                }

                .checkboxContainer {
                    width: 300px; /* Maak de checkbox container breder op grotere schermen */
                }
            }
        `;
    }


    render() {
        if (!this.measurement1 || !this.measurement2) {
            return html`
            <div class="container">
                <h2>Meting ${this.measurementId1} en ${this.measurementId2}</h2>
                <div class="loader"></div>
            </div>
        `;
        }

        return html`
        <div class="container">
            <div class="checkboxContainer">
                <h2>Meting ${this.measurementId1} en ${this.measurementId2}</h2>
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
            <div class="chartContainer">
                <canvas id="chart"></canvas>
            </div>
        </div>
    `;
    }

}


customElements.define('physio-measurement-compare', PhysioMeasurementCompare);