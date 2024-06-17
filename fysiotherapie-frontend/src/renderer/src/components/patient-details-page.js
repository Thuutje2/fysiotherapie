import { html, css, LitElement } from "lit";
import PatientService from "../service/patient-service.js";
import './patient-details-table.js';

class PatientDetailsPage extends LitElement {
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
        const result = await PatientService.getPatientDetails();
        if (result.success) {
            this.patient = result.patient;
        } else {
            this.error = result.error;
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
            }
        `;
    }

    render() {
        if (this.error) {
            return html`<p>${this.error}</p>`;
        }
        if (!this.patient) {
            return html`<p>Aan het laden...</p>`;
        }

        return html`
            <h2>Uw persoonlijke gegevens</h2>
            <patient-details-table .patient="${this.patient}"></patient-details-table>
        `;
    }
}

customElements.define("patient-details-page", PatientDetailsPage);