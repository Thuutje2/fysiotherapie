import { LitElement, html, css} from "lit";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

class Sports2dTest extends LitElement {
    static styles = css`
        /* Stijlen voor de terminal container */
        #terminal-container {
            width: 100%;
            height: 400px;
            background-color: #1e1e1e; /* Donkere achtergrond */
            color: #ffffff; /* Witte tekst */
            font-family: 'Courier New', Courier, monospace; /* Monospace font voor terminal gevoel */
            border: 1px solid #333; /* Donkere rand */
            overflow: hidden; /* Zorg ervoor dat content niet buiten de container loopt */
        }

        /* Algemene stijlen voor het component */
        :host {
            display: block;
            padding: 16px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        button {
            margin: 8px;
            padding: 8px 16px;
            background-color: #007acc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        button:hover {
            background-color: #005b9a;
        }

        h1 {
            color: #333;
        }
    `;

    static get properties() {
        return {
            terminalInitialized: { type: Boolean },
            loading: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.terminalInitialized = false;
        this.terminal = null;
        this.fitAddon = null;
        this.loading = false;
    }

    firstUpdated() {
        this.setupTerminal();
    }

    setupTerminal() {
    //     if (terminalContainer) {
    //         this.terminal = new Terminal();
    //         this.fitAddon = new FitAddon();

    //         this.terminal.loadAddon(this.fitAddon);
    //         this.terminal.open(terminalContainer);
    //         this.fitAddon.fit();

    //         window.api.onPowershellStdout((event, data) => {
    //             this.terminal.write(`\x1b[32m${data}\x1b[0m`); // Green for stdout
    //         });

    //         window.api.onPowershellStderr((event, data) => {
    //             this.terminal.write(`\x1b[31m${data}\x1b[0m`); // Red for stderr
    //         });

    //         window.api.onPowershellExit((event, code) => {
    //             console.log(`Process exited with code: ${code}`);
    //             this.terminal.write(`\nProcess exited with code: ${code}\n`);
    //         });

    //         this.terminalInitialized = true;
    //     } else {
    //         console.error('Terminal container not found!');
    //     }
    }

    render() {
        return html`
            <h1>Hello World from the Sports2DTest</h1>
            <button @click=${this.runConda} ?disabled=${this.loading}>Check for Sports2D</button>
            ${this.loading ? html`<div>Loading...</div>` : ''}
            ${this.uploadButtonVisible ? html`
                <form>
                    <label for="file">Upload een video bestand:</label>
                    <input type="file" id="file" name="file" @change="${this.onFileUpload}">
                    <button type="submit">Upload</button>
            ` : ''}
        `;
    }
    

    async runConda() {
        try {
            this.loading = true;

            window.api.runConda();

            window.api.onPowershellExit((event, code) => {
                console.log(`Process exited with code: ${code}`);
                code = parseInt(code);
                if (code === 0) {
                    console.log('Installatie voltooid!');
                    this.uploadButtonVisible = true;
                    this.requestUpdate();
                    this.loading = false;
                }
            });

        } catch (error) {
            console.error('Installatie mislukt:', error);
        } finally {
            this.loading = false;
        }
    }

    async onFileUpload(event) {
        console.log(event.target.files);
        const uploadedVideo = event.target.files[0];
        window.api.onUploadFileToSports2D(uploadedVideo);
    }
}

customElements.define("sports2d-test", Sports2dTest);
