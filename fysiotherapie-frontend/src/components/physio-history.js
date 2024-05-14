import {css, html, LitElement} from "lit";

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
                width: 150px

            }

            th {
                background-color: #f2f2f2;
            }
        `;
    }

    render() {
        const measurements = [
            {
                id: 1234,
                patient: "12345678",
                date: "16-04-2024",
                time: "10:00",
                activity: "Walking",
                treatment: "blabla",
                file: "1234.csv",
                video: "123"
            },
            {
                id: 123,
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
                        <td>${measurement.id}</td>
                        <td>${measurement.patient}</td>
                        <td>${measurement.date}</td>
                        <td>${measurement.time}</td>
                        <td>${measurement.activity}</td>
                        <td>${measurement.treatment}</td>
                        <td>${measurement.file}</td>
                        <td>${measurement.video}</td>
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
customElements.define('physio-history', PhysioHistory);
