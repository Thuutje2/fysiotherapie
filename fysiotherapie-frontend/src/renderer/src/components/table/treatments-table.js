import { html, css, LitElement } from "lit";

class TreatmentsTable extends LitElement {
    static properties = {
        treatments: { type: Array },
        sortOrder: { type: String }
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

    sortTreatmentsByStartDate() {
        debugger;
        const event = new CustomEvent("treatment-sorted", {
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

            .sortable {
                cursor: pointer;
                position: sticky;
                top: 0;
                z-index: 1;
            }

            .sortable::after {
                content: '';
                display: inline-block;
                margin-left: 5px;
            }

            .sortable.asc::after {
                content: ' &#9650;';
            }

            .sortable.desc::after {
                content: ' &#9660;';
            }
        `;
    }

    render() {
        return html`
            <table>
                <tr>
                    <th class="sortable" @click="${this.sortTreatmentsByStartDate}">Begindatum ${this.sortOrder === 'asc' ? html`&#9650;` : html`&#9660;`}</th>
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