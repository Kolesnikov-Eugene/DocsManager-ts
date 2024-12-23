let editor;

// Initialize DevExpress HtmlEditor
document.addEventListener('DOMContentLoaded', () => {
  editor = $("#editor").dxHtmlEditor({
    height: 400,
    toolbar: {
      items: [
        "undo",
        "redo",
        "separator",
        "bold",
        "italic",
        "underline",
        "separator",
        "orderedList",
        "bulletList",
        "separator",
        "link",
        "image",
      ],
    },
  }).dxHtmlEditor("instance");
});

// Open File Button Click
document.querySelector("#openFile").addEventListener("click", async () => {
  const fileData = await window.richEditApi.readFile();
  if (fileData) {
    editor.option("value", fileData.content);
  }
});

// Save File Button Click
document.querySelector("#saveFile").addEventListener("click", async () => {
  const content = editor.option("value");
  const filePath = await window.richEditApi.saveFile(content);
  if (filePath) {
    alert(`File saved at ${filePath}`);
  }
});