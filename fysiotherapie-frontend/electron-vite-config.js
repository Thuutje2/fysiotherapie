import { defineConfig } from "electron-vite";
import { resolve } from 'path'

export default defineConfig({
    publicDir: false,
    main: {},
    preload: {},
    renderer: {
        plugins: []
    }
});
