import {css, html, LitElement} from "lit";

class PhysioHoofdpagina extends LitElement {
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
            <p>U bent ingelogd als fysiotherapeut</p>
        `;
    }
}

customElements.define('physio-hoofdpagina', PhysioHoofdpagina);