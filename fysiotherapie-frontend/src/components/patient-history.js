import {css, html, LitElement} from "lit";

class PatientHistory extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
            }
        `;
    }

    render() {
        return html`
            <h2>Uw geschiedenis</h2>
        `;
    }
}

customElements.define('patient-history', PatientHistory);