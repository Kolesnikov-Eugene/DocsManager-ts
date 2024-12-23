const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let childWindow;

app.on('ready', () => {
  // Main Window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  // Child Window (Initially Hidden)
  childWindow = new BrowserWindow({
    parent: mainWindow,
    width: 600,
    height: 400,
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'child-preload.js'),
    },
  });

  childWindow.loadFile('child.html');

  // Open the Child Window on Request
  ipcMain.on('open-rich-edit', () => {
    childWindow.show();
  });

  // Handle File Open Request
  ipcMain.handle('read-file', async () => {
    const result = await dialog.showOpenDialog(childWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Text Files', extensions: ['txt', 'docx'] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const content = fs.readFileSync(filePath, 'utf-8');
      return { content, filePath };
    }

    return null;
  });

  // Handle File Save Request
  ipcMain.handle('save-file', async (event, { content }) => {
    const result = await dialog.showSaveDialog(childWindow, {
      filters: [{ name: 'Text Files', extensions: ['txt', 'docx'] }],
    });

    if (!result.canceled && result.filePath) {
      fs.writeFileSync(result.filePath, content, 'utf-8');
      return result.filePath;
    }

    return null;
  });
});