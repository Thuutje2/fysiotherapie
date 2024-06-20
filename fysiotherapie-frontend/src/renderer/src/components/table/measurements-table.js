import { html, css, LitElement } from "lit";

class MeasurementsTable extends LitElement {
    static properties = {
        measurements: {type: Array},
        selectedTreatment: {type: Object},
        compareMode: {type: Boolean},
        selectedMeasurements: {type: Object},
    };

    constructor() {
        super();
        this.measurements = [];
        this.selectedTreatment = null;
        this.compareMode = false;
        this.selectedMeasurements = new Set();
    }

    handleMeasurementClick(measurement) {
        debugger;
        const event = new CustomEvent("measurement-clicked", {
            detail: {measurement},
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    toggleMeasurementSelection(event, measurementId) {
        if (event.target.checked) {
            if (this.selectedMeasurements.size < 2) {
                this.selectedMeasurements.add(measurementId);
            } else {
                event.target.checked = false;
            }
        } else {
            this.selectedMeasurements.delete(measurementId);
        }
        this.requestUpdate();
    }

    toggleCheckboxOnClickRow(e) {
        debugger;
        if (e.target.matches('input[type=checkbox]')) return;

        const checkbox = e.target.closest('tr').querySelector('input[type=checkbox]');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            this.toggleMeasurementSelection(null, checkbox.dataset.measurementId);
        }
    }

    static get styles() {
        return css`
            table {
                border-collapse: collapse;
                width: 100%;
            }

            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
                width: 150px;
                position: relative;
            }

            th {
                background-color: #f2f2f2;
                position: sticky;
                top: 0;
                z-index: 1;
            }

            tr:hover {
                background: rgb(50, 151, 223, 0.8);
                cursor: pointer;
            }

            th.select-column {
                width: 50px;
            }

            td.select-column-data {
                width: 50px;
            }

        `;
    }

    render() {
        return html`
            ${this.selectedTreatment
                    ? html`
                        <table>
                            <thead>
                            <tr>
                                ${this.compareMode ? html`<th class="select-column">Selecteer</th>` : ''}
                                <th>Meting</th>
                                <th>Datum</th>
                                <th>Tijd</th>
                                <th>Activiteit</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${this.measurements && this.measurements.length > 0
                                    ? html`
                                        ${this.measurements.map(measurement => html`
                                            <tr @click="${this.compareMode
                                                    ? () => this.toggleCheckboxOnClickRow
                                                    : () => this.handleMeasurementClick(measurement)}">
                                                ${this.compareMode
                                                        ? html`
                                                            <td class="select-column-data">
                                                                <div @click="${(event) => event.stopPropagation()}">
                                                                    <input type="checkbox"
                                                                           data-measurement-id="${measurement.id}"
                                                                           .checked="${this.selectedMeasurements.has(measurement.id)}"
                                                                           @change="${(event) => this.toggleMeasurementSelection(event, measurement.id)}">
                                                                </div>
                                                            </td>`
                                                        : ''}
                                                <td>${measurement.id}</td>
                                                <td>${measurement.date}</td>
                                                <td>${measurement.time}</td>
                                                <td>${measurement.activity}</td>
                                            </tr>
                                        `)}
                                    `
                                    : html`
                                        <tr>
                                            <td colspan="5">Geen metingen beschikbaar</td>
                                        </tr>
                                    `
                            }
                            </tbody>
                        </table>`
                    : html`<p>Selecteer eerst een behandeling</p>`
            }
        `;
    }
}

customElements.define('measurements-table', MeasurementsTable);