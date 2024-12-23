const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openRichEdit: () => ipcRenderer.send('open-rich-edit'),
});