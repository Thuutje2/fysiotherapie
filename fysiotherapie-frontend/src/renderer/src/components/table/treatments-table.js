import { html, css, LitElement } from "lit";

class TreatmentsTable extends LitElement {
    static properties = {
        treatments: { type: Array }
    };

    handleSelectTreatment(treatment) {
        debugger;
        const event = new CustomEvent("treatment-selected", {
            detail: { treatment },
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
            <table>
                <tr>
                    <th>Begindatum</th>
                    <th>Einddatum</th>
                    <th>Conditie</th>
                </tr>
                ${this.treatments !== null ? html`
                    ${this.treatments.map(treatment => html`
                        <tr class="${this.selectedTreatment === treatment ? 'selected' : ''}" @click="${() => this.handleSelectTreatment(treatment)}">
                            <td>${treatment.startDate}</td>
                            <td>${treatment.endDate}</td>
                            <td>${treatment.condition}</td>
                        </tr>
                    `)}` 
                        : html`
                    <tr><td colspan="3">Geen behandelingen bekend</td></tr>
                `}
            </table>
        `;
    }
}

customElements.define('treatments-table', TreatmentsTable);