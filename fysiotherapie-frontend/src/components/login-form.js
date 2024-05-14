import {css, html, LitElement} from "lit";
import LoginService from "../service/login-service.js";

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
        height: 100%;
        width: 100%;
      }

      #content-container {
        display: grid;
        grid-template-rows: auto auto; 
        grid-gap: 10px; 
        justify-content: center;
        max-width: 900px;
        min-width: 20%;
        padding: 25px;
      }
      
      #form-container {
        width: 600px;
        padding: 25px;
        box-shadow: 10px 10px 15px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        border: 3px solid #3297DF;
      }

      #form-container h2 {
        margin-top: 5px;
        color: #3297DF;
      }

      #form-container label {
        display: block;
        margin-bottom: 5px;
      }

      #form-container input {
        background-color: white;
        display: block;
        margin-bottom: 10px;
        width: 98%;
        padding: 5px;
        border: 1px solid #3297DF;
        border-radius: 3px;
        height: 40px;
        font-size: 16px;
        color: black;
      }

      #form-container button {
        display: block;
        margin-top: 20px;
        margin-left: auto;
        color: black;
        padding: 10px;
        border-radius: 5px;
        background-color: white;
        border: 1px solid #3297DF;
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
        color: black;
        text-decoration: none;
        position: absolute;
      }

      #form-container a:hover {
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

      #login-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px; 
        width: 100%;
      }

      .image-sidebar {
        margin-right: auto; 
      }

      .login-text {
        margin-right: 250px;
      }
    `;

    render() {
        return html`
            <div id="content-container">
                <div id="form-container">
                    <div id="login-header">
                        <img src="../../public/RunningMan.png" alt="Logo" width="75" height="75" class="image-sidebar">
                        <h2 class="login-text">Inloggen</h2>
                    </div>
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
                                Login
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
                console.log("Password:", password);
                const token = await authService.authenticateUser(email, password);

                //Authentication error: Illegal arguments: string, undefined login-form.js:207:24

                // store the token
                sessionStorage.setItem("jwtToken", token);

                // User gets redirected to after successful login
                window.location.href = "./patient";
            } catch (error) {
                console.error("Authentication error:", error.message);
                console.log(error)
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