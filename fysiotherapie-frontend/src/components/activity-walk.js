import { css, html, LitElement } from "lit";

class ActivityWalk extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
                font-family: Inter, sans-serif;
            }

            .title {
                font-size: 36px;
                margin-top: auto;
            }

            .line {
                width: 105px;
                height: 4px;
                background-color: #3297DF;
            }

            .chart-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }

            .chart-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                flex-basis: calc(33.33% - 10px);
                margin-bottom: 20px;
            }

            .select-data {
                margin-bottom: 10px;
            }

            .select-box {
                border: 1px solid #ccc;
                max-height: 150px;
                overflow-y: auto;
                transition: max-height 0.3s ease;
                margin-right: 1100px;
            }

            .option {
                padding: 5px;
                border-bottom: 1px solid #ccc;
                
            }

            .option label {
                margin-left: 5px;
            }

            .option:last-child {
                border-bottom: none;
            }

            .collapse-btn {
                cursor: pointer;
            }

            canvas {
                width: 400px !important;
                height: 190px !important;
            }
        `;
    }

    constructor() {
        super();
        this.loadChartLibrary().then(() => {
            this.createCharts();
        });
        this.selectedOptions = new Set();
    }

    async loadChartLibrary() {
        if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
            document.body.appendChild(script);
            await new Promise(resolve => {
                script.onload = resolve;
            });
        }
    }

    createCharts() {
        const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
        const chartData = [
            { data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478], borderColor: "black", backgroundColor: "black", fill: false },
            { data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000], borderColor: "black", fill: false },
            { data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100], borderColor: "black", fill: false },

            { data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478], borderColor: "black", backgroundColor: "black", fill: false },
            { data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000], borderColor: "black", fill: false },
            { data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100], borderColor: "black", fill: false },

            { data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478], borderColor: "black", backgroundColor: "black", fill: false },
            { data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000], borderColor: "black", fill: false },
            { data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100], borderColor: "black", fill: false }
        ];

        const chartContainer = this.shadowRoot.querySelector('.chart-container');
        let currentRow;

        chartData.forEach((data, index) => {
            if (index % 3 === 0) {
                currentRow = document.createElement('div');
                currentRow.classList.add('chart-row');
                chartContainer.appendChild(currentRow);
            }

            const canvas = document.createElement('canvas');
            currentRow.appendChild(canvas);
            new window.Chart(canvas, {
                type: "line",
                data: {
                    labels: xValues,
                    datasets: [data]
                },
                options: {
                    legend: { display: false }
                }
            });
        });
    }


    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        const selectBox = this.shadowRoot.getElementById('select-box');
        selectBox.style.maxHeight = this.isCollapsed ? '0' : '150px';
    }

    handleCheckboxChange(event) {
        const { value, checked } = event.target;
        const checkboxes = this.shadowRoot.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkbox.value === value && checked;
        });
        this.filterCharts();
    }

    filterCharts() {
        const chartRows = this.shadowRoot.querySelectorAll('.chart-row');
        chartRows.forEach(row => {
            const groupName = row.dataset.group; // Groepnaam van de rij
            const shouldDisplay = Array.from(row.querySelectorAll('input[type="checkbox"]')).some(checkbox => checkbox.checked && checkbox.value === groupName);
            row.style.display = shouldDisplay ? 'flex' : 'none'; // Toon de rij als een van de geselecteerde checkboxes overeenkomt met de groep
        });
    }




    getGroupName(index) {
        const groupIndex = Math.floor(index / 3); // Bereken de index van de groep (0 voor right-knee, 1 voor left-knee, 2 voor left-hip)
        if (groupIndex === 0) {
            return 'right-knee'; // Groepnaam voor de eerste drie grafieken
        } else if (groupIndex === 1) {
            return 'left-knee'; // Groepnaam voor de middelste drie grafieken
        } else {
            return 'left-hip'; // Groepnaam voor de laatste drie grafieken
        }
    }


    render() {
        return html`
            <h1 class="title">Lopen
                <div class="line"></div>
            </h1>
            <div class="select-data">
                <label for="select-data" class="collapse-btn" @click="${this.toggleCollapse}">Selecteer datatype:</label>
                <div class="select-box" id="select-box">
                    <div class="option">
                        <input type="checkbox" id="option1" value="right-knee" @change="${this.handleCheckboxChange}">
                        <label for="option1">right-knee</label>
                    </div>
                    <div class="option">
                        <input type="checkbox" id="option2" value="left-knee" @change="${this.handleCheckboxChange}">
                        <label for="option2">left-knee</label>
                    </div>
                    <div class="option">
                        <input type="checkbox" id="option3" value="left-hip" @change="${this.handleCheckboxChange}">
                        <label for="option3">left-hip</label>
                    </div>
                </div>
            </div>
            <div class="chart-container"></div>
        `;
    }
}

customElements.define('activity-walk', ActivityWalk);
