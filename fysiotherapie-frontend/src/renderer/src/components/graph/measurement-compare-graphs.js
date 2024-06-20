import { css, html, LitElement } from "lit";
import PatientService from "../../service/patient-service.js";
import Chart from 'chart.js/auto';

class MeasurementCompareGraphs extends LitElement {
    static get properties() {
        return {
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
        this.jointTypes = [];
        this.jointPairs = [];
        this.checkedValues = {};
        this.chart = null;
    }

    async connectedCallback() {
        super.connectedCallback()
        if (this.measurement1 && this.measurement2) {
            if (Array.isArray(this.measurement1)) {
                this.jointTypes = this.measurement1.map(jointData => jointData.jointType);
                this.jointPairs = this.groupJointTypes(this.jointTypes);
                await this.updateComplete;
                this.renderChart();
            }
        }
    }

    groupJointTypes(jointTypes) {
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
        const result = await PatientService.getMeasurementForPhysio(patientId, treatmentId, measurementId);
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
        this.renderChart();
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
                    label: `${jointType} - Meting ${this.measurement1.id}`,
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
                    label: `${jointType} - Meting ${this.measurement2.id}`,
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
                            text: 'Angles'
                        }
                    }
                }
            }
        });
    }

    getColorForJointType(jointType, isSecondChart = false) {
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
            .container {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                width: 100%;
            }

            .joint-title {
                width: 100%;
                margin-bottom: 0;
                padding: 0;
            }

            .joint-checkboxes {
                font-size: 11px;
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
            }

            .joint-pairs {
                width: 105px;
                margin-right: 10px;
                margin-bottom: 10px;
            }

            .checkbox {
                margin-right: 10px;
            }

            canvas {
                max-height: 90.5%;
                max-width: 90%;
                margin-top: 5px;
                flex: 2;
                padding: 0;
            }
        `;
    }

    render() {
        return html`
            <div class="joint-checkboxes">
                ${Object.entries(this.jointPairs).map(([key, value]) => html`
            <div class="joint-pairs">
            ${value[1] ? html`
                <div class="joint-left">
                    <input 
                        class="checkbox" 
                        type="checkbox" 
                        id="${value[1]}" 
                        name="${value[1]}" 
                        value="${value[1]}"
                        @change="${this.handleCheckboxChange}"
                        ?checked="${this.checkedValues[value[1]]}">
                    <label class="joint-name" for="${value[1]}">${value[1]}</label>
                </div>` : ''}
                
                ${value[0] ? html`
                <div class="joint-right">
                    <input 
                        class="checkbox" 
                        type="checkbox" 
                        id="${value[0]}" 
                        name="${value[0]}" 
                        value="${value[0]}"
                        @change="${this.handleCheckboxChange}"
                        ?checked="${this.checkedValues[value[0]]}">
                    <label class="joint-name" for="${value[0]}">${value[0]}</label>
                </div>` : ''}
            </div>
        `)}
                <canvas id="chart"></canvas>
            </div>
        `;
    }
}


customElements.define('measurement-compare-graphs', MeasurementCompareGraphs);