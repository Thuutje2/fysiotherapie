import {html, css, LitElement} from "lit";
import PatientService from "../service/patient-service.js";

class PatientInformation extends LitElement {
    static properties = {
        patient: { type: Object },
        error: { type: String }
    };

    constructor() {
        super();
        this.patient = null;
        this.error = "";
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadPatientData();
    }

    async loadPatientData() {
        const result = await PatientService.getPatientInformationForPatient();
        if (result.success === true ) {
            this.patient = result.patient;
        }
        else {
            this.error = result.error;
        }
    }

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
        if (this.error !== "") {
            return html`<p>${this.error}</p>`;
        }
        if (!this.patient) {
            return html`<p>Aan het laden...</p>`;
        }

        return html`
      <h2>Uw persoonlijke gegevens</h2>
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

customElements.define("patient-information", PatientInformation);