import { css, html, LitElement } from "lit";

class PhysioMeasurement extends LitElement {
    static get styles() {
        return css`
            :host {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }

            .form-container {
                background-color: #f0f0f0;
                width: 400px;
                padding: 2em;
                border-radius: 10px;
                margin-left: 400px;
                margin-top: 80px;
                margin-bottom: 70px;
            }

            form {
                display: grid;
                gap: 1em;
            }

            label {
                display: block;
                font-weight: bold;
            }

            input[type="text"],
            input[type="number"],
            input[type="date"],
            input[type="time"],
            input[type="file"] {
                width: 100%;
                padding: 0.5em;
                border: 1px solid #ccc;
                border-radius: 5px;
            }

            input[type="submit"] {
                background-color: #007bff;
                color: #fff;
                border: none;
                padding: 0.5em 1em;
                border-radius: 5px;
                cursor: pointer;
            }

            input[type="submit"]:hover {
                background-color: #0056b3;
            }
        `;
    }

    render() {
        return html`
            <div class="form-container">
                <h2>Een nieuwe meting aanmaken</h2>
                <form @submit="${this.handleSubmit}">
                    <label for="patient">Patientnummer:</label>
                    <select id="patient" name="patient" required>
                        <option value="1">Patient 1</option>
                        <option value="2">Patient 2</option>
                        <option value="3">Patient 3</option>
                    </select>
                    
                    <label for="date">Datum:</label>
                    <input type="date" id="date" name="date" required>

                    <label for="time">Tijd:</label>
                    <input type="time" id="time" name="time" required>

                    <label for="activity">Activiteit:</label>
                    <select id="activity" name="activity" required>
                        <option value="1">Lopen</option>
                        <option value="2">Rennen</option>
                        <option value="3">Springen</option>
                    </select>

                    <label for="treatment">Behandeling:</label>
                    <select id="treatment" name="treatment" required>
                        <option value="1">Breuk herstel</option>
                    </select>
                    
                    <label for="file">Bestand:</label>
                    <input type="file" id="file" name="file" @change="${this.handleFileSelect}" required>

                    <label for="video">Video:</label>
                    <input type="file" id="video" name="video" @change="${this.handleFileSelect}">

                    <input type="submit" value="Meting aanmaken">
                </form>
            </div>
        `;
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        console.log("Geselecteerd bestand:", file);
    }

    handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log("Formuliergegevens:", data);
    }
}

customElements.define('physio-measurement', PhysioMeasurement);
