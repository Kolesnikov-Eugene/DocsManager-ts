import React, { useState } from 'react';
import FolderTree from './components/FolderTree';
import DocumentTable from './components/DocumentTable';
import { Folder } from "./components/types";

const folderData: Folder[] = [
  {
    id: "1",
    name: "Folder 1",
    children: [
      { id: "1.1", name: "Subfolder 1.1" },
      { id: "1.2", name: "Subfolder 1.2" },
    ],
  },
  {
    id: "2",
    name: "Folder 2",
    children: [
      {
        id: "2.1",
        name: "Subfolder 2.1",
        children: [
          { id: "2.1.1", name: "Sub-subfolder 2.1.1" },
          { id: "2.1.2", name: "Sub-subfolder 2.1.2" },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  // Изменяем тип состояния на массив строк
  const [documents, setDocuments] = useState<string[]>([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toolbar */}
      <div style={{ height: '50px', backgroundColor: '#f0f0f0', padding: '10px' }}>
        <h3>Toolbar</h3>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Folder Tree */}
        <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <FolderTree folders={folderData} />
        </div>

        {/* Documents Table */}
        <div style={{ flex: 1, padding: '10px' }}>
          <DocumentTable documents={documents} />
        </div>
      </div>
    </div>
  );
};

export default App;