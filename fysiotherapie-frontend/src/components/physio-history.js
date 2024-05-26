import { css, html, LitElement } from "lit";

class PhysioHistory extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
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

            .popup {
                position: absolute;
                background-color: #f9f9f9;
                border: 1px solid #ccc;
                padding: 3px; 
                border-radius: 3px; 
                font-size: 0.7em; 
                z-index: 1;
                color: black;
        `;
    }

    render() {
        const measurements = [
            {
                id: 8368642237,
                patient: "12345678",
                date: "16-04-2024",
                time: "10:00",
                activity: "Walking",
                treatment: "blabla",
                file: "1234.csv",
                video: "123"
            },
            {
                id: 9374957201,
                patient: "12345678",
                date: "16-04-2024",
                time: "10:00",
                activity: "Walking",
                treatment: "blabla",
                file: "1234.csv",
                video: "123"
            },
        ];

        return html`
            <h2>Uw geschiedenis</h2>
            <table>
                <tr>
                    <th>Meting</th>
                    <th>Patientnummer</th>
                    <th>Datum</th>
                    <th>Tijd</th>
                    <th>Activiteit</th>
                    <th>Soort behandeling</th>
                    <th>Bestand</th>
                    <th>Video</th>
                </tr>
                ${measurements.map(measurement => html`
                    <tr>
                        <td>
                            <a href="#" 
                               @click="${() => this.showGraphics(measurement)}"
                               @mouseover="${this.showPopup}"
                               @mouseout="${this.hidePopup}">
                               ${measurement.id}
                            </a>
                        </td>
                        <td>${measurement.patient}</td>
                        <td>${measurement.date}</td>
                        <td>${measurement.time}</td>
                        <td>${measurement.activity}</td>
                        <td>${measurement.treatment}</td>
                        <td>${measurement.file}</td>
                        <td>${measurement.video}</td>
                    </tr>
                `)}
            </table>
        `;
    }

    showGraphics(appointment) {
        console.log("Grafieken weergeven voor:", appointment.activity);
    }

    showPopup(event) {
        const popup = document.createElement('div');
        popup.textContent = "Klik om de meetresultaten in te zien";
        popup.classList.add('popup');
        event.target.appendChild(popup);
    }

    hidePopup(event) {
        const popup = event.target.querySelector('.popup');
        if (popup) {
            popup.remove();
        }
    }
}

customElements.define('physio-history', PhysioHistory);
