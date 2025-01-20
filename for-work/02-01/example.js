// renderer
async function openDocument(byteArray, fileType = 'docx') {
    // Convert byte array to Blob
    const blob = new Blob([byteArray], { type: `application/${fileType}` });

    // Convert Blob to Object URL
    const fileURL = URL.createObjectURL(blob);

    // Load the document into RichEdit
    richEdit.openDocument(fileURL, fileType);

    // Cleanup: Revoke the Object URL to free memory
    URL.revokeObjectURL(fileURL);
}

// Example Usage: Receiving a byte array and opening it
ipcRenderer.on('receive-file', (event, byteArray) => {
    openDocument(byteArray, 'docx'); // Adjust 'docx' based on the file type from the backend
});

async function saveDocumentToByteArray(fileType = 'docx') {
    // Save the document as a Blob
    const blob = await richEdit.saveDocument({ type: fileType });

    // Convert Blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // Convert ArrayBuffer to Uint8Array (byte array)
    const byteArray = new Uint8Array(arrayBuffer);

    return byteArray;
}

// Example Usage: Saving the document and sending it to the backend
document.getElementById('saveButton').addEventListener('click', async () => {
    const byteArray = await saveDocumentToByteArray('docx');
    ipcRenderer.send('save-file', byteArray);
});

// Main process
ipcMain.on('fetch-file', async (event, fileId) => {
    const byteArray = await fetchFileFromBackend(fileId); // Fetch from backend
    event.sender.send('receive-file', byteArray); // Send to renderer
});

ipcMain.on('save-file', async (event, byteArray) => {
    const result = await sendFileToBackend(byteArray); // Send to backend
    console.log('File saved successfully:', result);
});

// BYTES
const fs = require('fs');

const emptyRtfString = "{\\rtf1}";
const encoder = new TextEncoder();
const emptyRtfBytes = encoder.encode(emptyRtfString);

fs.writeFileSync('empty.rtf', Buffer.from(emptyRtfBytes)); // Use Buffer.from for Node.js file system
console.log("Empty RTF file created.");

// ANOTHER
const emptyRtfString1 = "{\\rtf1}";
const encoder1 = new TextEncoder();
const emptyRtfBytes1 = encoder.encode(emptyRtfString1);

console.log(emptyRtfBytes1); // Output: Uint8Array [123, 92, 114, 116, 102, 49, 125] (ASCII codes)


// ChatGpt
// Create an empty byte array
const emptyByteArray = new Uint8Array([]);

// Initialize the DevExtreme RichEdit widget
const richEdit = $("#richEditContainer").dxRichEdit({
    height: 500,
    width: "100%",
}).dxRichEdit("instance");

// Load the empty byte array as an RTF document
richEdit.loadDocument(emptyByteArray, "rtf");


// PRELOAD
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onCallClientFunction: (callback) => {
        ipcRenderer.on('call-client-function', (event, data) => {
            callback(data);
        });
    },
});

// MAIN
const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: __dirname + '/preload.js',
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Send a message to the renderer process
    setTimeout(() => {
        mainWindow.webContents.send('call-client-function', { message: 'Hello from Main Process!' });
    }, 3000);
});

// EXT JS
<!DOCTYPE html>
<html>
<head>
    <title>Ext JS and Electron</title>
    <script src="path-to-extjs/ext-all.js"></script>
    <script>
        Ext.onReady(function () {
            // Define the function to be called
            function myClientFunction(data) {
                console.log('Function called with data:', data);
                Ext.Msg.alert('Message', `Data received: ${data.message}`);
            }

            // Use the exposed API to listen for messages from the main process
            window.electronAPI.onCallClientFunction((data) => {
                myClientFunction(data); // Call the Ext JS function
            });
        });
    </script>
</head>
<body>
    <div id="app"></div>
</body>
</html>