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

          .sidebar img {
            margin-top: 20px;
          }

          .sidebar h1 {
            margin-top: -10px; 
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
                <img src="../../../public/RunningMan.png" alt="Logo" width="75" height="75" class="image-sidebar">
                <h1>Dashboard</h1>
                <div class="line"></div>
            </div>
        `;
    }
}

customElements.define('sidebar-component', SidebarComponent);