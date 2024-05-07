import {css, html, LitElement} from "lit";

class PatientMainpage extends LitElement {
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
            <h1>Welkom bij de fysiotherapie applicatie</h1>
            <p>U bent ingelogd als patiënt</p>
        `;
    }
}

customElements.define('patient-hoofdpagina', PatientMainpage);