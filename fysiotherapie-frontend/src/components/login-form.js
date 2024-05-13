import {css, html, LitElement} from "lit";

class LoginForm extends LitElement {
    static properties = {
        loggedIn: {type: Boolean},
    };

    connectedCallback() {
        super.connectedCallback();
        this.loggedIn = false;
    }

    static styles = css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: var(--kpn-achtergrond-lichtblauw);
        height: 100%;
        width: 100%;
      }

      #content-container {
        display: grid;
        grid-template-rows: auto auto; /* Twee rijen, één voor titel en één voor formulier */
        grid-gap: 10px; /* Ruimte tussen de rijen */
        justify-content: center;
        max-width: 900px;
        min-width: 20%;
        padding: 25px;
      }

      #titel-container h1 {
        margin-top: 0px;
        margin-bottom: 10px;
        color: var(--kpn-groen);
      }

      #form-container {
        width: 100%;
        background-color: var(--kpn-wit);
        padding: 25px;
        box-shadow: 10px 10px 15px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }

      #form-container h3 {
        margin-top: 5px;
        color: var(--kpn-zwart);
      }

      #form-container label {
        display: block;
        margin-bottom: 5px;
        color: var(--kpn-zwart);
      }

      #form-container input {
        display: block;
        margin-bottom: 10px;
        color: var(--kpn-zwart);
        width: 98%;
        padding: 5px;
        border: 1px solid #000;
        border-radius: 3px;
        height: 40px;
        font-size: 16px;
      }

      #form-container button {
        display: block;
        margin-top: 10px;
        margin-left: auto;
        background-color: var(--kpn-groen);
        color: var(--kpn-wit);
        border: none;
        padding: 10px;
        border-radius: 5px;
      }

      #form-container button:hover {
        cursor: pointer;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
      }

      #wachtwoord-vergeten {
        margin-top: 4%;
        position: relative;
      }

      #form-container a {
        font-style: italic;
        color: var(--kpn-zwart);
        text-decoration: none;
        position: absolute;
      }

      #form-container a:hover {
        color: var(--kpn-groen);
        text-decoration: underline;
      }

      #errorMessage {
        color: #ff0000;
        font-weight: bold;
        margin: 10px;
        padding: 10px;
        background-color: #facdca;
        border-style: solid;
        border-color: #ff0000;
        border-radius: 10px;
        display: none;
      }
    `;

    render() {
        return html`
            <div id="content-container">
                <div id="titel-container">
                    <h1><strong>Aanmelden</strong></h1>
                </div>
                <div id="form-container">
                    <h3><strong>Welkom terug!</strong></h3>
                    <form @submit=${this.onSubmit} id="loginform">
                        <label for="emailInput"><strong>Gebruikersaccount:</strong></label>
                        <input
                                aria-label="Invoer veld om uw gebruikersaccount, uw email adres, in te voeren"
                                type="email"
                                id="emailInput"
                                name="emailInput"
                                placeholder="someone@example.com"
                                required
                        />

                        <label for="passwordInput"><strong>Wachtwoord:</strong></label>
                        <input
                                aria-label="Input veld om uw wachtwoord in te voeren"
                                type="password"
                                id="passwordInput"
                                name="passwordInput"
                                placeholder="password"
                                required
                        />

                        <div id="wachtwoord-vergeten">
                            <a
                                    href="#"
                                    id="forgotPasswordLink"
                                    @click=${this.onForgotPassword}
                                    aria-label="Link om te gaan naar de pagina waar u uw wachtwoord opnieuw kunt instellen, als u uw wachtwoord bent vergeten"
                            >
                                Wachtwoord vergeten?
                            </a>
                            <button
                                    @click=${this.onSubmit}
                                    type="submit"
                                    aria-label="Knop om in te loggen"
                            >
                                verzend
                            </button>
                        </div>
                        <div id="errorMessage">
                            <div>
                                Helaas, er is geen account gevonden met deze e-mail en/of
                                wachtwoord
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    async onSubmit(event) {
        event.preventDefault();

        const email = this.shadowRoot.getElementById("loginform")[0].value;
        const password = this.shadowRoot.getElementById("loginform")[1].value;
        const errorMessage = this.shadowRoot.getElementById("errorMessage");

        if (this.isValidEmail(email)) {
            try {
                const authService = new LoginService();
                const token = await authService.authenticateUser(email, password);

                // store the token
                sessionStorage.setItem("jwtToken", token);

                // User gets redirected to after succesful login
                window.location.href = "./travel-form";
            } catch (error) {
                console.error("Authentication error:", error.message);
                errorMessage.style.display = "block";

                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 5000);
            }
        } else {
            errorMessage.style.display = "block";

            setTimeout(() => {
                errorMessage.style.display = "none";
            }, 5000);
            alert(`${email} is niet correct!`);
        }
    }

    onForgotPassword(event) {
        event.preventDefault();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

customElements.define("login-form", LoginForm);