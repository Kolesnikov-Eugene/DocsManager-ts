const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendMessage: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  onMessage: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
});