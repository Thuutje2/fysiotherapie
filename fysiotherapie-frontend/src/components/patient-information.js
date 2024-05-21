import {css, html, LitElement} from "lit";

class PatientInformation extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
            }
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
        // Hardgecodeerde patiëntgegevens
        const patient = {
            firstname: "Henk",
            lastname: "Janssen",
            patientnumber: "123456",
            birthdate: "01-01-2000",
            age: 24,
            height: "180 cm",
            weight: "75 kg"
        };

        return html`
            <h2>Uw persoonlijke gegevens</h2>
            <table>
                <tr>
                    <th>Voornaam</th>
                    <td>${patient.firstname}</td>
                </tr>
                <tr>
                    <th>Achternaam</th>
                    <td>${patient.lastname}</td>
                </tr>
                <tr>
                    <th>Patiëntnummer</th>
                    <td>${patient.patientnumber}</td>
                </tr>
                <tr>
                    <th>Geboortedatum</th>
                    <td>${patient.birthdate}</td>
                </tr>
                <tr>
                    <th>Leeftijd</th>
                    <td>${patient.age}</td>
                </tr>
                <tr>
                    <th>Lengte</th>
                    <td>${patient.height}</td>
                </tr>
                <tr>
                    <th>Gewicht</th>
                    <td>${patient.weight}</td>
                </tr>
            </table>
        `;
    }
}

customElements.define('patient-information', PatientInformation);