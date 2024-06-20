import { css, html, LitElement } from "lit";
import Chart from 'chart.js/auto';

class MeasurementGraphs extends LitElement {a
    static get properties() {
        return {
            measurement: { type: Object },
            jointTypes: { type: Array },
            jointPairs: { type: Object },
            checkedValues: { type: Object }
        };
    }

    constructor() {
        super();
        this.measurement = null;
        this.jointTypes = [];
        this.jointPairs = [];
        this.checkedValues = {};
        this.chart = null;
    }

    async connectedCallback() {
        super.connectedCallback()
        this.jointTypes = this.measurement.map(jointData => jointData.jointType);
        this.jointPairs = this.groupJointTypes(this.jointTypes);
        await this.updateComplete;
        this.renderChart();
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

    handleCheckboxChange(event) {
        const { id, checked } = event.target;
        const checkedCount = Object.values(this.checkedValues).filter(val => val).length;

        if (checked && checkedCount >= 2) {
            event.target.checked = false;
            return;
        }

        this.checkedValues = { ...this.checkedValues, [id]: checked };
        this.renderChart();
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

    renderChart() {
        const ctx = this.shadowRoot.getElementById('chart').getContext('2d');

        const datasets = Object.keys(this.checkedValues)
            .filter(jointType => this.checkedValues[jointType])
            .map(jointType => {
                const { seconds, positions } = this.getAllSecondsAndPositions(jointType);
                return {
                    label: jointType,
                    data: seconds.map((second, index) => ({ x: second, y: positions[index] })),
                    borderColor: this.getColorForJointType(jointType),
                    borderWidth: 1,
                    fill: false
                };
            });

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets.length > 0 ? datasets : []
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

    getColorForJointType(jointType) {
        const colors = {
        };
        const selectedJointTypes = Object.keys(this.checkedValues).filter(jt => this.checkedValues[jt]);
        const index = selectedJointTypes.indexOf(jointType);
        if (index !== -1) {
            const defaultColors = ['rgb(75, 192, 192)', 'rgb(192, 75, 75)'];
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
customElements.define('measurement-graphs', MeasurementGraphs);