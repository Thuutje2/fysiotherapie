import {css, html, LitElement} from "lit";

class SidebarComponent extends LitElement {
    static get styles() {
        return css`
          :host {
            font-family: Inter, sans-serif;
          }
          
          .sidebar {
            height: 100vh; 
            background-color: #3297DF;
            color: white;
            overflow-y: hidden;
            text-align: center;
            position: relative; /* Hiermee kunnen we de position: absolute van de #logout-btn relatief aan de .sidebar maken */
          }

          .sidebar img {
            margin-top: 20px;
          }

          .sidebar h1 {
            margin-top: -10px;
          }

          .sidebar h1 a {
            color: white;
            text-decoration: none; 
            cursor: pointer; 
          }
          
          a {
            color: white;
            text-decoration: none;
            cursor: pointer;
          }


          .line {
            width: 100%; 
            height: 2px; 
            background-color: white; 
          }

          .links-container a {
            display: block;
            padding: 10px 0;
            color: white;
            border-bottom: 1px solid white;
          }

          .links-container a.active {
            background-color: #1E5B9E;
          }

          #logout-btn {
            position: absolute;
            bottom: 10px; 
            width: 100%; 
            display: flex;
            justify-content: center; 
          }

          #logout-btn img {
            width: 25px;
            height: 25px;
          }

        `;
    }

    render() {
        return html`
            <div class="sidebar">
                <img src="../../../public/RunningMan.png" alt="Logo" width="75" height="75" class="image-sidebar">
                <h1><a href="/">Dashboard</a></h1>
                <div class="line"></div>

                <div class="links-container">
                    <!-- .hidden=!this._isLoggedIn -->
                    <!--PATIËNT-->
                    <!-- en dan hier moet iets komen van als je patient bent dan zie je deze links-->
                    <a href="/test" @click="${this.handleLinkClick}">Mijn gegevens</a>
                    <a href="/#" @click="${this.handleLinkClick}">Historie</a>
                </div>

                <a id="logout-btn" href="#" @click="${this.handleLogout}">
                    <img src="../../../public/logout-48.png" alt="Uitloggen">
                </a>
            </div>

        `;
    }

    handleLinkClick(event) {
        const links = this.shadowRoot.querySelectorAll('.links-container a');
        links.forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');
    }
}

customElements.define('sidebar-component', SidebarComponent);
