import {css, html, LitElement} from "lit";
import DataService from "../service/data-service.js";

class PatientHoofdpagina extends LitElement {
    constructor() {
        super();
        this.dataService = new DataService();
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

            <form @submit="${this.onUpload}" enctype="multipart/form-data">
                <label for="file">File</label>
                <input id="file" name="file" type="file" />
                <button>Upload</button>
            </form>
        `;
    }

    onUpload(e) {
        e.preventDefault();

        const fileUpload = e.target[0].files[0]

        console.log(fileUpload)



        const formData = new FormData()
        formData.append('file', fileUpload)

        this.dataService.fileUpload(formData).then(r => console.log("test"))
    }

}

customElements.define('patient-hoofdpagina', PatientHoofdpagina);