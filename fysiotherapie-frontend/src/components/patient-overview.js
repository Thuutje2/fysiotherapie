import { css, html, LitElement } from "lit";

class PatientOverview extends LitElement {
    static get properties() {
        return {
            isPopupVisible: { type: Boolean },
        };
    }

    constructor() {
        super();
        this.isPopupVisible = false;
    }

    togglePopup() {
        this.isPopupVisible = !this.isPopupVisible;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
                position: relative; 
            }

            .container {
                position: relative;
            }

            .add-button {
                position: absolute;
                top: 0;
                right: 0;
                margin: 1em;
            }
            

            table {
                border-collapse: collapse;
                width: 100%;
            }

            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
                width: 150px;
                position: relative; 
            }

            th {
                background-color: #f2f2f2;
            }

            .overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }

            .overlay[visible] {
                display: flex;
            }

            .popup {
                background-color: white;
                padding: 2em;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);                
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }


            .popup form {
                display: flex;
                flex-direction: column;
            }

            .popup form label {
                display: inline-block;
                width: 120px; 
                margin-right: 10px; 
            }


            .popup form input {
                margin-bottom: 1em;
                padding: 0.5em;
                border: 1px solid #ccc;
                border-radius: 3px;
            }


            .popup form button {
                padding: 0.5em;
                border: none;
                background-color: #007BFF;
                color: white;
                border-radius: 3px;
                cursor: pointer;
            }


            .close-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
            }

            #submitButton {
                padding: 0.5em 2em;
                border: none;
                background-color: #3297DF;
                color: white;
                border-radius: 3px;
                cursor: pointer;
                margin-top: 1em;
            }


            #submitButton:hover {
                background-color: #0056b3;
            }
        `;
    }

    render() {
        const patients = [
            {
                id: "12345678",
                firstname: "Henk",
                lastname: "Blok",
                email: "henk@gmail.com",
                birthdate: "01-01-2000",
                age: "24",
                length: "0",
                weigt: "0"
            },
        ];

        return html`
            <div class="container">
                <h2>Patiëntenoverzicht</h2>
                <button @click="${this.togglePopup}" class="add-button">Voeg patiënt toe</button>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Voornaam</th>
                        <th>Achternaam</th>
                        <th>Email</th>
                        <th>Geboortedatum</th>
                        <th>Leeftijd</th>
                        <th>Lengte</th>
                        <th>Gewicht</th>
                    </tr>
                    ${patients.map(patient => html`
                        <tr>
                            <td>${patient.id}</td>
                            <td>${patient.firstname}</td>
                            <td>${patient.lastname}</td>
                            <td>${patient.email}</td>
                            <td>${patient.birthdate}</td>
                            <td>${patient.age}</td>
                            <td>${patient.length}</td>
                            <td>${patient.weigt}</td>
                        </tr>
                    `)}
                </table>
            </div>
            <div class="overlay" ?visible="${this.isPopupVisible}">
                <div class="popup">
                    <button class="close-button" @click="${this.togglePopup}">&times;</button>
                    <h3>Voeg een nieuwe patiënt toe</h3>
                    <form @submit="${this.handleSubmit}">
                        <div>
                            <label for="firstname">Voornaam:</label>
                            <input type="text" id="firstname" name="firstname" placeholder="Voornaam" required>
                        </div>
                        <div>
                            <label for="lastname">Achternaam:</label>
                            <input type="text" id="lastname" name="lastname" placeholder="Achternaam" required>
                        </div>
                        <div>
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" placeholder="Email" required>
                        </div>
                        <div>
                            <label for="birthdate">Geboortedatum:</label>
                            <input type="date" id="birthdate" name="birthdate" placeholder="Geboortedatum" required>
                        </div>
                        <div>
                            <label for="weight">Gewicht:</label>
                            <input type="text" id="weight" name="weight" placeholder="Gewicht" required>
                        </div>
                        <div>
                            <label for="length">Lengte:</label>
                            <input type="text" id="length" name="length" placeholder="Lengte" required>
                        </div>
                        <button id="submitButton" type="submit">Opslaan</button>
                    </form>

                </div>
            </div>

        `;
    }

    handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const patient = Object.fromEntries(formData.entries());
        console.log("Nieuwe patient gegevens:", patient);
        this.togglePopup();
    }
}

customElements.define('patient-overview', PatientOverview);
