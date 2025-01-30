import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FolderTree from './components/FolderTree';
import DocumentTable from './components/DocumentTable';
import { Folder } from './components/ItemTypes'; // Make sure to import your Folder type
import { ItemTypes } from './components/ItemTypes';
import './App.css';


const App: React.FC = () => {
  const [folders, setFolders] = useState<Folder[] | undefined>([
    {
      id: "1",
      name: "Folder 1",
      children: [
        { id: "1-1", name: "Subfolder 1" },
        { id: "1-2", name: "Subfolder 2", children: [{id: "1-2-1", name: "SubSubfolder 1"}] },
      ],
    },
    { id: "2", name: "Folder 2" },
  ]);

  const [documents, setDocuments] = useState<string[] | undefined>(["Document 1", "Document 2", "Document 3"]);

  const handleFolderDrop = (targetFolderId: string, droppedItem: any) => {
    if (!folders || !documents) return; // Guard against undefined values

    console.log("Dropped item:", droppedItem, "on folder:", targetFolderId);

    if (droppedItem.type === ItemTypes.DOCUMENT) {
      setDocuments(documents.filter(doc => doc !== droppedItem.name));
    }

    setFolders(prevFolders => {
      if (!prevFolders) return []; // Guard against undefined prevFolders

      const updatedFolders = [...prevFolders];

      const findAndAdd = (folders: Folder[]) => {
        for (let folder of folders) {
          if (folder.id === targetFolderId) {
            if (!folder.children) folder.children = [];
            if (droppedItem.type === ItemTypes.FOLDER) {
              const draggedFolder = updatedFolders.find(f => f.id === droppedItem.id);
              if (draggedFolder) {
                folder.children.push(draggedFolder);
                const parentFolder = findParentFolder(updatedFolders, draggedFolder.id);
                if (parentFolder) {
                  parentFolder.children = parentFolder.children?.filter(f => f.id !== draggedFolder.id);
                }
              }
            } else if (droppedItem.type === ItemTypes.DOCUMENT) {
              folder.children.push({ id: droppedItem.name, name: droppedItem.name } as Folder);
            }
            return true;
          }
          if (folder.children && findAndAdd(folder.children)) return true;
        }
        return false;
      };

      const findParentFolder = (folders: Folder[], childId: string): Folder | null => {
        for (let folder of folders) {
          if (folder.children?.find(child => child.id === childId)) return folder;
          const parent = findParentFolder(folder.children || [], childId);
          if (parent) return parent;
        }
        return null;
      };

      findAndAdd(updatedFolders);
      return updatedFolders;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
       <div className="app-container"> {/* Main container */}
        <div className="toolbar">
          {/* Your toolbar content goes here */}
          <button>New Folder</button>
          <button>New Document</button>
          {/* Add more toolbar buttons or elements as needed */}
        </div>
        <div className="main-content"> {/* Content area below toolbar */}
          <div className="sidebar"> {/* Sidebar for FolderTree */}
            <FolderTree folders={folders || []} onFolderDrop={handleFolderDrop} />
          </div>
          <div className="document-area"> {/* Area for DocumentTable */}
            <DocumentTable documents={documents || []} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;