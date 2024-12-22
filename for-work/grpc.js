// index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevExpress RichEdit in Electron</title>
  <link rel="stylesheet" href="node_modules/devexpress-richedit/dist/dx.richedit.css">
  <style>
    #richEditContainer {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="richEditContainer"></div>
  <script src="renderer.js"></script>
</body>
</html>

Renderer

import { RichEdit } from 'devexpress-richedit';

// Create RichEdit instance
const richEdit = RichEdit.create(document.getElementById('richEditContainer'), {
    // Configuration options
    document: {
        viewSettings: {
            viewType: 'print'
        }
    },
    readOnly: false
});

// Expose basic operations
window.richEdit = richEdit;

Main.js

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: `${__dirname}/preload.js`, // Enable secure communication
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
});

// Handle open file
ipcMain.handle('open-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: [{ name: 'Documents', extensions: ['docx', 'txt', 'rtf'] }],
        properties: ['openFile']
    });

    if (canceled) return null;
    const filePath = filePaths[0];
    const content = fs.readFileSync(filePath);
    return { content, filePath };
});

// Handle save file
ipcMain.handle('save-file', async (event, { content, filePath }) => {
    if (!filePath) {
        const { canceled, filePath: newPath } = await dialog.showSaveDialog({
            filters: [{ name: 'Documents', extensions: ['docx', 'txt', 'rtf'] }]
        });
        if (canceled) return null;
        filePath = newPath;
    }

    fs.writeFileSync(filePath, Buffer.from(content));
    return filePath;
});
Preload 

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('open-file'),
    saveFile: (data) => ipcRenderer.invoke('save-file', data)
});


Update Renderer

document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.createElement('button');
    openButton.textContent = 'Open Document';
    openButton.addEventListener('click', async () => {
        const result = await window.electronAPI.openFile();
        if (result && result.content) {
            const { content } = result;
            richEdit.openDocument(content);
        }
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Document';
    saveButton.addEventListener('click', async () => {
        const documentContent = await richEdit.saveDocument('docx');
        await window.electronAPI.saveFile({ content: documentContent });
    });

    document.body.appendChild(openButton);
    document.body.appendChild(saveButton);
});



GRPC subscribe

Proto

syntax = "proto3";

package example;

service ExampleService {
  rpc SubscribeToUpdates(SubscribeRequest) returns (stream UpdateResponse);
}

message SubscribeRequest {
  string client_id = 1;
}

message UpdateResponse {
  string message = 1;
}

Main

const { app, BrowserWindow, ipcMain } = require('electron');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the proto file
const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

// Create gRPC client
const client = new exampleProto.ExampleService(
  'localhost:50051', // Replace with your server address
  grpc.credentials.createInsecure()
);

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');
});

// Handle gRPC subscription
ipcMain.on('start-subscription', (event) => {
  const call = client.SubscribeToUpdates({ client_id: 'electron-client' });

  call.on('data', (response) => {
    event.sender.send('subscription-update', response.message);
  });

  call.on('error', (err) => {
    console.error('gRPC Error:', err);
    event.sender.send('subscription-error', err.message);
  });

  call.on('end', () => {
    console.log('Subscription ended');
    event.sender.send('subscription-end');
  });
});

Preload

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('grpcAPI', {
  startSubscription: () => ipcRenderer.send('start-subscription'),
  onUpdate: (callback) => ipcRenderer.on('subscription-update', (_, message) => callback(message)),
  onError: (callback) => ipcRenderer.on('subscription-error', (_, error) => callback(error)),
  onEnd: (callback) => ipcRenderer.on('subscription-end', callback),
});



Renderer
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.createElement('button');
  startButton.textContent = 'Start Subscription';
  document.body.appendChild(startButton);

  const updatesDiv = document.createElement('div');
  document.body.appendChild(updatesDiv);

  startButton.addEventListener('click', () => {
    window.grpcAPI.startSubscription();

    window.grpcAPI.onUpdate((message) => {
      const update = document.createElement('p');
      update.textContent = `Update: ${message}`;
      updatesDiv.appendChild(update);
    });

    window.grpcAPI.onError((error) => {
      const errorMsg = document.createElement('p');
      errorMsg.textContent = `Error: ${error}`;
      errorMsg.style.color = 'red';
      updatesDiv.appendChild(errorMsg);
    });

    window.grpcAPI.onEnd(() => {
      const endMsg = document.createElement('p');
      endMsg.textContent = 'Subscription ended.';
      endMsg.style.color = 'blue';
      updatesDiv.appendChild(endMsg);
    });
  });
});

