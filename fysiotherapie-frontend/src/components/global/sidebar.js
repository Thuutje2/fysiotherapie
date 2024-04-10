import {css, html, LitElement} from "lit";

class SidebarComponent extends LitElement {
    static get styles() {
        return css`
          :host {
            
          }

          .sidebar {
            width: 180px;
            height: 100%;
            background-color: #3297DF;
            color: white;
            padding: 20px;
          }
        `;
    }


    render() {
        return html`
            <div class="sidebar">
                <h1>Dashboard</h1>
            </div>
        `;
    }
}

customElements.define('sidebar-component', SidebarComponent);