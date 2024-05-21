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


          canvas {
            width: 400px !important;
            height: 190px !important;
          }

          .header {
            display: flex;
            align-items: center; 
          }

          .title {
            margin-right: 20px; 
          }
          
          input[type="file"] {
            margin-left: auto;
          }

        `;
    }

    constructor() {
        super();
        this.loadChartLibrary().then(() => {
            this.createCharts();
        });
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
        const xValues = [100,200,300,400,500,600,700,800,900,1000];
        const chartData = [
            { data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478], borderColor: "black", backgroundColor: "black", fill: false },
            { data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000], borderColor: "black", fill: false },
            { data: [300,700,2000,5000,6000,4000,2000,1000,200,100], borderColor: "black", fill: false },

            { data: [300,700,2000,5000,6000,4000,2000,1000,200,100], borderColor: "black", fill: false },
            { data: [300,700,2000,5000,6000,4000,2000,1000,200,100], borderColor: "black", fill: false },
            { data: [300,700,2000,5000,6000,4000,2000,1000,200,100], borderColor: "black", fill: false },

            { data: [300,700,2000,5000,6000,4000,2000,1000,200,100], borderColor: "black", fill: false },
            { data: [300,700,2000,5000,6000,4000,2000,1000,200,100], borderColor: "black", fill: false },
            { data: [300,700,2000,5000,6000,4000,2000,1000,200,100], borderColor: "black", fill: false }
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

            currentRow.appendChild(canvas);
        });
    }

    render() {
        return html`
        <div class="header">
            <h1 class="title">Lopen
                <div class="line"></div>
            </h1>
            <input type="file">
        </div>
        <div class="chart-container"></div>
    `;
    }

}

customElements.define('activity-walk', ActivityWalk);

