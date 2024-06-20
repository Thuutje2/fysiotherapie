import { contextBridge, ipcRenderer } from "electron";
const API = {
  // sendCheckPython1: () => ipcRenderer.send("check-sports2D-installation"),
  runConda: () => ipcRenderer.send("check-sports2D-installation"),
  onPowershellStdout: (callback) => ipcRenderer.on("powershell-stdout", callback),
  onPowershellStderr: (callback) => ipcRenderer.on("powershell-stderr", callback),
  onPowershellExit: (callback) => ipcRenderer.on("powershell-exit", callback),
  onUploadFileToSports2D: (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      ipcRenderer.send("upload-file-to-sports2d", {
        fileName: "demo.mp4",
        fileBuffer: Buffer.from(arrayBuffer)
      });
    };
    reader.readAsArrayBuffer(file);
  }
};
contextBridge.exposeInMainWorld("api", API);
