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
            position: relative;
          }

          .sidebar .image-sidebar {
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
            text-decoration: none;
          }

          .links-container a.active {
            background-color: #1E5B9E;
          }

          .dropdown-menu {
            list-style-type: none;
            text-decoration: none;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #3297DF; 
            padding: 0; 
            margin: 0;
          }

          .dropdown-menu li a {
            display: block;
            padding: 10px; 
            color: white;
            text-decoration: none;
          }

          .dropdown-image {
            margin-left: 5px;
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

    constructor() {
        super();
        this.isDropdownVisible = false;
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
                    <a href="/patient-information" @click="${this.handleLinkClick}">Mijn gegevens</a>
                    <a href="/patient-history" @click="${this.handleLinkClick}">Historie</a>
                    <!--FYSIOTHERAPEUT-->
                    <!-- en dan hier moet iets komen van als je fysiotherapeut bent dan zie je deze links-->
                    <a href="/patient-overview" @click="${this.handleLinkClick}">Patiënten</a>
                    <a @click="${this.toggleDropdown}">Activiteit <img src="../../../public/sort-down.png" width="15" height="15" class="dropdown-image"> </a>
                    <ul class="dropdown-menu" ?hidden="${!this.isDropdownVisible}">
                        <li><a href="/activity-walk" @click="${this.handleLinkClick}">Lopen</a></li>
                        <li><a href="/#" @click="${this.handleLinkClick}">Gooien</a></li>
                        <li><a href="/#" @click="${this.handleLinkClick}">Rennen</a></li>
                    </ul>
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

    toggleDropdown() {
        this.isDropdownVisible = !this.isDropdownVisible;
        this.requestUpdate();
    }
}

customElements.define('sidebar-component', SidebarComponent);
