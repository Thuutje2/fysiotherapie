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

    ipcMain.on("upload-file-to-sports2d", (event, { fileName, fileBuffer }) => {
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
            console.log(`child process exited with code ${code}`);
            event.sender.send('powershell-exit', code.toString());
        });
    });


    // ipcMain.on("upload-file-to-sports2d", (event, { fileName, fileBuffer }) => {
    //     // Bepaal waar je het bestand wilt opslaan
    //     const uploadPath = path.join(currentWorkingDirectory, 'uploads', fileName);

    //     // Zorg ervoor dat de uploads map bestaat
    //     fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

    //     // Schrijf het bestand naar de schijf
    //     fs.writeFile(uploadPath, fileBuffer, (err) => {
    //         if (err) {
    //             console.error('Fout bij het opslaan van het bestand:', err);
    //             event.sender.send('upload-file-to-sports2d-response', { success: false, message: 'Failed to save file.' });
    //             return;
    //         }

    //         console.log(`Bestand opgeslagen op ${uploadPath}`);

    //         const condaActivate = "C:\\Users\\daanf\\miniconda3\\Scripts\\activate.bat";
    //         const videoDirectory = path.dirname(uploadPath);
    //         const configPath = join(currentWorkingDirectory, 'uploads', 'Config_demo.toml')

    //         const pythonScriptPath = path.join(currentWorkingDirectory, 'python', 'main.py');

    //         const escapedConfigPath = configPath.replace(/\\/g, '\\\\'); 

    //         const powershellCommands = [
    //             `cd "${videoDirectory}"`,
    //             `& "${condaActivate}"`,
    //             `conda activate Sports2D`,
    //             `pip install sports2d`,
    //             `pip install opencv-python==4.5.5.64`,
    //             `python "${pythonScriptPath}" "${configPath}"` ,
    //             // `ipython -c "from Sports2D import Sports2D"`,
    //             // `ipython -c "Sports2D.detect_pose(r'${escapedConfigPath}')"`, 
    //             // `ipython -c "Sports2D.compute_angles(r'${escapedConfigPath}');"`
    //         ].join(' ; ');

    //         const processFile = spawn("powershell.exe", ["-Command", powershellCommands]);

    //         processFile.stdout.on('data', (data) => {
    //             console.log(`stdout: ${data}`);
    //             event.sender.send('powershell-stdout', data.toString());
    //         });

    //         processFile.stderr.on('data', (data) => {
    //             console.error(`stderr: ${data}`);
    //             event.sender.send('powershell-stderr', data.toString());
    //         });

    //         processFile.on('close', (code) => {
    //             console.log(`Process exited with code ${code}`);
    //             event.sender.send('powershell-exit', code.toString());
    //         });

    //         // Geef een succesvolle reactie terug naar de frontend
    //         event.sender.send('upload-file-to-sports2d-response', { success: true, message: 'File uploaded and processed successfully.' });
    //     });
    // });
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
