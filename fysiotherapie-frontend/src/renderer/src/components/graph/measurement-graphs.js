import { css, html, LitElement } from "lit";
import Chart from 'chart.js/auto';
import PatientService from "../../service/patient-service.js";
import AuthService from "../../service/auth-service.js";

class MeasurementGraphs extends LitElement {
    static get properties() {
        return {
            _isAdmin: {type: Boolean},
            _isUser: {type: Boolean},

            patientId: {type: String},
            treatmentId: {type: String},
            measurementId: {type: String},
            measurement: {type: Array},

            allJointTypes: {type: Array},
            allJointPairs: {type: Object},
            checkedJoints: {type: Object}
        };
    }

    constructor() {
        super();
        this._isAdmin = AuthService.isAdmin();
        this._isUser = AuthService.isUser();

        this.patientId = null;
        this.treatmentId = null;
        this.measurementId = null;
        this.measurement = [];

        this.allJointTypes = [];
        this.allJointPairs = {};
        this.checkedJoints = {};
        this.chart = null;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.allJointTypes = await this.loadJointTypes();
        this.allJointPairs = this.groupJointTypes(this.allJointTypes);
        this.renderChart();
    }

    async loadJointTypes() {
        let result = [];
        if (this._isAdmin) {
            result = await PatientService.getJointTypesForPhysio(this.patientId, this.treatmentId, this.measurementId);
        }
        else if (this._isUser) {
            result = await PatientService.getJointTypesForPatient(this.treatmentId, this.measurementId);
        }
        if (result.success) {
            return result.data;
        }
    }

    async loadMeasurementForPhysioPerJoint(jointType) {
        const result = await PatientService.getMeasurementForPhysioPerJoint(this.patientId, this.treatmentId, this.measurementId, jointType);
        if (result.success) {
            return result.data;
        }
    }

    async loadMeasurementForPatientPerJoint(jointType) {
        const result = await PatientService.getMeasurementForPatientPerJoint(this.treatmentId, this.measurementId, jointType);
        if (result.success) {
            return result.data;
        }
    }

    groupJointTypes(jointTypes) {
        const groupedJoints = {};
        jointTypes.forEach(joint => {
            let type = joint.type.replace(/\b(left|right)\b/i, "").trim();
            type = type.charAt(0).toUpperCase() + type.slice(1);

            if (!groupedJoints[type]) {
                groupedJoints[type] = [];
            }
            groupedJoints[type].push(joint.type);
        });
        return groupedJoints;
    }

    getAllSecondsAndAngles(jointType) {
        if (!Array.isArray(this.measurement)) {
            return {seconds: [], angles: []};
        }

        const data = this.measurement[jointType];
        if (data) {
            const seconds = Object.keys(data.secondsToPosition).map(parseFloat);
            const angles = Object.values(data.secondsToPosition).map(parseFloat);
            return {seconds, angles};
        }
        return {seconds: [], angles: []};
    }

    getColorForJointType(jointType) {
        const colors = {};
        const selectedJointTypes = Object.keys(this.checkedJoints).filter(jt => this.checkedJoints[jt]);
        const index = selectedJointTypes.indexOf(jointType);
        if (index !== -1) {
            const defaultColors = ['rgb(75, 192, 192)', 'rgb(192, 75, 75)'];
            return defaultColors[index % defaultColors.length];
        } else {
            return 'rgb(75, 75, 192)';
        }
    }

    renderChart() {
        const ctx = this.shadowRoot.getElementById('chart').getContext('2d');

        const datasets = Object.keys(this.checkedJoints)
            .filter(jointType => this.checkedJoints[jointType])
            .map(jointType => {
                const {seconds, angles} = this.getAllSecondsAndAngles(jointType);
                return {
                    label: jointType,
                    data: seconds.map((second, index) => ({x: second, y: angles[index]})),
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
                ${Object.entries(this.allJointPairs).map(([key, value]) => html`
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
                                        ?checked="${this.checkedJoints[value[1]]}">
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
                                        ?checked="${this.checkedJoints[value[0]]}">
                                <label class="joint-name" for="${value[0]}">${value[0]}</label>
                            </div>` : ''}
                    </div>
                `)}
                <canvas id="chart"></canvas>
            </div>
        `;
    }

    async handleCheckboxChange(event) {
        const {id, checked} = event.target;
        const checkedJointCount = Object.values(this.checkedJoints).filter(val => val).length;

        if (checked && checkedJointCount >= 2) {
            event.target.checked = false;
            return;
        }

        this.checkedJoints = {...this.checkedJoints, [id]: checked};
        await this.handleJointTypeChange();
        this.renderChart();
    }

    async handleJointTypeChange() {
        for (const [id, isChecked] of Object.entries(this.checkedJoints)) {
            if (isChecked && !this.measurement[id]) {
                let measurement = null;
                if (this._isAdmin) {
                    measurement = await this.loadMeasurementForPhysioPerJoint(id);
                }
                else if (this._isUser) {
                    measurement = await this.loadMeasurementForPatientPerJoint(id);
                }
                if (measurement) {
                    this.measurement[id] = measurement;
                }
            }
        }
        this.requestUpdate();
    }
}
customElements.define('measurement-graphs', MeasurementGraphs);