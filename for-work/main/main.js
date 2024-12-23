const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;
let childWindow;

app.on('ready', () => {
  // Main Window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: __dirname + '/preload.js', // Preload script
    },
  });

  mainWindow.loadFile('index.html');

  // Create Child Window (Initially Hidden)
  childWindow = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 300,
    show: false, // Initially hidden
    webPreferences: {
      contextIsolation: true,
      preload: __dirname + '/child-preload.js', // Preload script for child
    },
  });

  childWindow.loadFile('child.html');

  // Handle Event from Renderer to Show the Child Window
  ipcMain.on('show-child-window', () => {
    if (childWindow) {
      childWindow.show();
    }
  });

  ipcMain.on('message-from-child', (event, data) => {
    console.log('Message from child:', data);
    // Optionally, forward to main window
    mainWindow.webContents.send('message-to-main', data);
  });
  
  ipcMain.on('message-from-main', (event, data) => {
    console.log('Message from main:', data);
    // Optionally, forward to child window
    childWindow.webContents.send('message-to-child', data);
  });
});