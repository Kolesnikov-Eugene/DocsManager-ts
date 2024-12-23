const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('childApi', {
  readFile: () => ipcRenderer.invoke('read-file'),
  saveFile: (content) => ipcRenderer.invoke('save-file', { content }),
});