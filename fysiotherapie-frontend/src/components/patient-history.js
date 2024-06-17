import {css, html, LitElement} from "lit";

class PatientHistory extends LitElement {
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
                width: 120px

            }

            th {
                background-color: #f2f2f2;
            }
        `;
    }

    render() {
        const appointments = [
            {
                date: "16-04-2024",
                time: "10:00",
                activity: "Walking"
            },
            {
                date: "17-04-2024",
                time: "14:00",
                activity: "Running"
            },
        ];

        return html`
            <h2>Uw geschiedenis</h2>
            <table>
                <tr>
                    <th>Datum</th>
                    <th>Tijd</th>
                    <th>Activiteit</th>
                </tr>
                ${appointments.map(appointment => html`
                    <tr>
                        <td>${appointment.date}</td>
                        <td>${appointment.time}</td>
                        <td><a href="#" @click="${() => this.showGraphics(appointment)}">${appointment.activity}</a>
                        </td>
                    </tr>
                `)}
            </table>
        `;
    }

    showGraphics(appointment) {
        console.log("Grafieken weergeven voor:", appointment.activity);
    }
}

customElements.define('patient-history', PatientHistory);