import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

let mainWindow;

const currentWorkingDirectory = process.cwd();

function createWindow() {
    console.log(currentWorkingDirectory);

    mainWindow = new BrowserWindow({
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: join(currentWorkingDirectory, 'out/preload/preload.mjs'),
        }
    });

    mainWindow.loadURL('http://localhost:5173');
    mainWindow.on('closed', () => mainWindow = null);
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on("check-sports2D-installation", (event, args) => {
        const batchFilePath = join(currentWorkingDirectory, 'batch', 'run_conda.bat');

        const createAndActivateSports2D = spawn(batchFilePath, [], {
            shell: true,
        });

        createAndActivateSports2D.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            event.sender.send('powershell-stdout', data.toString());
        });

        createAndActivateSports2D.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            event.sender.send('powershell-stderr', data.toString());
        });

        createAndActivateSports2D.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            event.sender.send('powershell-exit', code.toString());
        });
    });

    ipcMain.on("upload-file-to-sports2d", (event, { fileName, fileBuffer, pId, sId, activity }) => {
        const uploadPath = path.join(currentWorkingDirectory, 'uploads', fileName);

        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        fs.writeFile(uploadPath, fileBuffer, (err) => {
            if (err) {
                console.error('Failed to save file:', err);
                event.sender.send('upload-file-to-sports2d-response', { success: false, message: 'Failed to save file.' });
                return;
            }

            console.log(`File saved at ${uploadPath}`);
        });

        const batchFilePath = join(currentWorkingDirectory, 'batch' , 'main.bat');
        const createAndUploadFile = spawn(batchFilePath, [], {
            shell: true,
        });

        createAndUploadFile.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            event.sender.send('powershell-stdout', data.toString());
        });

        createAndUploadFile.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            event.sender.send('powershell-stderr', data.toString());
        });

        createAndUploadFile.on('close', (code) => {
            console.log(`File process exited with code ${code}`);

            if (code === 0) {
                const csvFileName = 'video_BLAZEPOSE_person0_angles.csv';
                const csvFilePath = path.join(currentWorkingDirectory, 'uploads', csvFileName);

                fs.readFile(csvFilePath, (err, csvBuffer) => {
                    if (err) {
                        console.error('Failed to read CSV file:', err);
                        event.sender.send('upload-file-to-sports2d-response', { success: false, message: 'Failed to read CSV file.' });
                        return;
                    }

                    event.sender.send('upload-file-to-sports2d-response', {
                        success: true,
                        message: 'File processed successfully.',
                        csvBuffer: csvBuffer // De buffer van de CSV
                    });
                });
            } else {
                event.sender.send('upload-file-to-sports2d-response', { success: false, message: `Batch process failed with code ${code}` });
            }
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});
