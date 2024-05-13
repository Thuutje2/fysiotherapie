import { css, html, LitElement } from "lit";

class ActivityWalk extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1em;
                font-family: Inter, sans-serif;
            }

            .header {
                display: flex;
                align-items: center;
                height: 20px;
            }

            .title {
                font-size: 36px;
                margin-top: auto;
            }

            input[type="file"] {
                margin-left: auto;
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
                flex-direction: column;
                align-items: center;
                margin-bottom: 20px;
            }

            .chart-row > div {
                margin-bottom: 10px; 
                font-size: 14px; 
            }

            .chart-row canvas {
                width: 100%;
                height: auto;
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
            this.filterCharts();
        });
        this.checkedValues = {
            'right-knee': false,
            'left-knee': false,
            'left-hip': false
        };
        this.handleAllCheckboxChange = this.handleAllCheckboxChange.bind(this);
    }

    async firstUpdated() {
        await this.loadChartLibrary();
        this.createCharts();
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
            { data: [10, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478], borderColor: "black", backgroundColor: "black", fill: false },
            { data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000], borderColor: "black", fill: false },
            { data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100], borderColor: "black", fill: false },

            { data: [2000, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478], borderColor: "black", backgroundColor: "black", fill: false },
            { data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000], borderColor: "black", fill: false },
            { data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100], borderColor: "black", fill: false },

            { data: [5000, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478], borderColor: "black", backgroundColor: "black", fill: false },
            { data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000], borderColor: "black", fill: false },
            { data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100], borderColor: "black", fill: false }
        ];

        const chartContainer = this.shadowRoot.querySelector('.chart-container');

        chartData.forEach((data, index) => {
            const canvas = document.createElement('canvas');
            const chartRow = document.createElement('div');
            chartRow.classList.add('chart-row');
            const chartWrapper = document.createElement('div');
            chartWrapper.classList.add('chart-wrapper');

            const indexTexts = {
                0: "Left-knee x-data",
                1: "Left-knee y-data",
                2: "Left-knee z-data",
                3: "Right-knee x-data",
                4: "Right-knee y-data",
                5: "Right-knee z-data",
                6: "Left-hip x-data",
                7: "Left-hip y-data",
                8: "Left-hip z-data",
            };
            if (indexTexts.hasOwnProperty(index)) {
                const textElement = document.createElement('div');
                textElement.textContent = indexTexts[index];
                chartRow.appendChild(textElement);
            }

            chartRow.appendChild(canvas);
            chartWrapper.appendChild(chartRow);
            chartContainer.appendChild(chartWrapper);

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
        this.filterCharts();
    }




    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        const selectBox = this.shadowRoot.getElementById('select-box');
        selectBox.style.maxHeight = this.isCollapsed ? '0' : '150px';
    }

    handleCheckboxChange(event) {
        const { value, checked } = event.target;
        this.checkedValues[value] = checked;
        this.filterCharts();
    }


    filterCharts() {
        const chartRows = this.shadowRoot.querySelectorAll('.chart-row');
        const visibleRows = Array.from(chartRows).filter(row => row.style.display !== 'none');
        const flexBasis = visibleRows.length > 0 ? `calc(${100 / visibleRows.length}% - 10px)` : '100%';
        chartRows.forEach(row => {
            row.style.flexBasis = flexBasis;
        });

        chartRows.forEach((row, index) => {
            const groupName = this.getGroupName(index);
            const shouldDisplay = this.checkedValues[groupName];
            row.style.display = shouldDisplay ? 'flex' : 'none';
        });
    }


    getGroupName(index) {
        const groupIndex = Math.floor(index / 3);
        if (groupIndex === 0) {
            return 'left-knee';
        } else if (groupIndex === 1) {
            return 'right-knee';
        } else if (groupIndex === 2) {
            return 'left-hip';
        }
    }

    handleAllCheckboxChange(event) {
        const { checked } = event.target;
        Object.keys(this.checkedValues).forEach(key => {
            this.checkedValues[key] = checked;
        });
        this.filterCharts();
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
                        <input type="checkbox" id="optionAll" value="all" @change="${this.handleAllCheckboxChange}">
                        <label for="optionAll">All data</label>
                    </div>
                    <div class="option">
                        <input type="checkbox" id="option1" value="right-knee" @change="${this.handleCheckboxChange}">
                        <label for="option1">Right-knee</label>
                    </div>
                    <div class="option">
                        <input type="checkbox" id="option2" value="left-knee" @change="${this.handleCheckboxChange}">
                        <label for="option2">Left-knee</label>
                    </div>
                    <div class="option">
                        <input type="checkbox" id="option3" value="left-hip" @change="${this.handleCheckboxChange}">
                        <label for="option3">Left-hip</label>
                    </div>
                </div>
            </div>
            <div class="chart-container"></div>
        `;
    }
}

customElements.define('activity-walk', ActivityWalk);
