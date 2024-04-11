import {css, html, LitElement} from "lit";

class SidebarComponent extends LitElement {
    static get styles() {
        return css`
          .sidebar {
            height: 100vh; 
            background-color: #3297DF;
            color: white;
            overflow-y: hidden;
            text-align: center;
          }

          .line {
            width: 100%; 
            height: 2px; 
            background-color: white; 
          }

        `;
    }

    render() {
        return html`
            <div class="sidebar">
                <img src="./images/RunningMan.png" alt="Logo" width="100" height="100">
                <h1>Dashboard</h1>
                <div class="line"></div>
            </div>
        `;
    }
}

customElements.define('sidebar-component', SidebarComponent);