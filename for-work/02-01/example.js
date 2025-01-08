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