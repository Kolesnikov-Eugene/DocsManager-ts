const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openRichEdit: () => ipcRenderer.send('open-rich-edit'),
});

// preload updated
const { contextBridge, ipcRenderer } = require('electron');
const richEdit = require('devexpress-richedit');

contextBridge.exposeInMainWorld('richeditAPI', {
  initRichEdit: (containerId) => {
    const options = richEdit.createOptions();

    // Handle the saving event
    options.events.saving = (s, e) => {
      ipcRenderer.send(
        'richedit-save-document',
        e.base64,
        e.fileName + richEdit.Utils.documentFormatToExtension(e.format)
      );
      e.handled = true;
    };

    // Initialize the RichEdit control
    const rich = richEdit.create(document.querySelector(`#${containerId}`), options);

    // Handle document reply from the main process
    ipcRenderer.on('richedit-get-document-reply', (event, base64DocumentContent, fileName) => {
      const pathInfo = richEdit.Utils.parseFilePath(fileName);
      if (base64DocumentContent !== null) {
        rich.openDocument(base64DocumentContent, pathInfo.nameWithoutExtension, pathInfo.documentFormat);
      } else {
        rich.documentName = pathInfo.nameWithoutExtension;
        rich.documentFormat = pathInfo.documentFormat;
      }
    });

    // Request the document from the main process
    ipcRenderer.send('richedit-get-document', 'test.docx');
  },
});