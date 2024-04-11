import {css, html, LitElement} from "lit";

class SidebarComponent extends LitElement {
    static get styles() {
        return css`
          .sidebar {
            height: 94.3vh; 
            background-color: #3297DF;
            color: white;
            padding: 20px;
            overflow-y: hidden;
          }

        `;
    }

    render() {
        return html`
            <div class="sidebar">
                <img src="./images/RunningMan.png" alt="Logo" width="100" height="100">
                <h1>Dashboard</h1>
            </div>
        `;
    }
}

customElements.define('sidebar-component', SidebarComponent);