import { css, html, LitElement} from "lit";

class PhysioTreatments extends LitElement {
    render() {
        return html`
            <h2>Behandelingen</h2>`;
    }

}

customElements.define('physio-treatments', PhysioTreatments)