import {css, html, LitElement} from "lit";

class PatientHistoryGraphics extends LitElement {
    static get properties() {
        return {
            activity: { type: String }
        };
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
            <p>Grafieken voor: ${this.activity}</p>
        `;
    }
}

customElements.define('patient-history-graphics', PatientHistoryGraphics);