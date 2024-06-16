import {css, html, LitElement} from "lit";

class PatientMainPage extends LitElement {
    constructor() {
        super();
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
        return html`
            <h1>Welkom bij de fysiotherapie applicatie</h1>
            <p>U bent ingelogd als patiënt</p>
        `;
    }
}

customElements.define('patient-main-page', PatientMainPage);