import { html, css, LitElement } from "lit";

class DetailsPatientTable extends LitElement {
    static properties = {
        patient: { type: Object }
    };

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
            }
            th {
                background-color: #f2f2f2;
            }
        `;
    }

    render() {
        return html`
            <table>
                <tr>
                    <th>Voornaam</th>
                    <td>${this.patient.firstName}</td>
                </tr>
                <tr>
                    <th>Achternaam</th>
                    <td>${this.patient.lastName}</td>
                </tr>
                <tr>
                    <th>Patiëntnummer</th>
                    <td>${this.patient.id}</td>
                </tr>
                <tr>
                    <th>Geboortedatum</th>
                    <td>${this.patient.dateOfBirth}</td>
                </tr>
                <tr>
                    <th>Leeftijd</th>
                    <td>${this.patient.age}</td>
                </tr>
                <tr>
                    <th>Lengte (cm)</th>
                    <td>${this.patient.height}</td>
                </tr>
                <tr>
                    <th>Gewicht (kg)</th>
                    <td>${this.patient.weight}</td>
                </tr>
            </table>
        `;
    }
}

customElements.define('details-patient-table', DetailsPatientTable);