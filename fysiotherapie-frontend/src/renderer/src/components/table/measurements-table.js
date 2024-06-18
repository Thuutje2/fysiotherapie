import { html, css, LitElement } from "lit";

class MeasurementsTable extends LitElement {
    static properties = {
        measurements: { type: Array },
        selectedTreatment: { type: Object }
    };

    handleMeasurementClick(measurement) {
        debugger;
        const event = new CustomEvent("measurement-clicked", {
            detail: { measurement },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
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
        `;
    }

    render() {
        return html`
            ${this.selectedTreatment 
                    ? html`
                <table>
                    <tr>
                        <th>Meting</th>
                        <th>Datum</th>
                        <th>Tijd</th>
                        <th>Activiteit</th>
                    </tr>
                    ${this.measurements 
                            ? html`
                        ${this.measurements.map(measurement => html`
                            <tr @click="${() => this.handleMeasurementClick(measurement)}">
                                <td>${measurement.id}</td>
                                <td>${measurement.date}</td>
                                <td>${measurement.time}</td>
                                <td>${measurement.activity}</td>
                            </tr>
                        `)}`
                            : html`
                            <tr><td colspan="4">Geen metingen bekend</td></tr>
                        `}
                </table>` 
                    : html`<p>Selecteer eerst een behandeling</p>
           `
        }`
    }
}

customElements.define('measurements-table', MeasurementsTable);