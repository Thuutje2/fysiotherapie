import { contextBridge, ipcRenderer } from "electron";
const API = {
  runConda: () => ipcRenderer.send("check-sports2D-installation"),
  onPowershellStdout: (callback) => ipcRenderer.on("powershell-stdout", callback),
  onPowershellStderr: (callback) => ipcRenderer.on("powershell-stderr", callback),
  onPowershellExit: (callback) => ipcRenderer.on("powershell-exit", callback),
  onUploadFileToSports2D: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        ipcRenderer.send("upload-file-to-sports2d", {
          fileName: "video.mp4",
          fileBuffer: Buffer.from(arrayBuffer)
        });
        ipcRenderer.once("upload-file-to-sports2d-response", (event, response) => {
          if (response.success) {
            resolve(response.csvBuffer);
          } else {
            reject(response.message);
          }
        });
      };
      reader.onerror = () => {
        reject("Failed to read the file.");
      };
      reader.readAsArrayBuffer(file);
    });
  }
};
contextBridge.exposeInMainWorld("api", API);
