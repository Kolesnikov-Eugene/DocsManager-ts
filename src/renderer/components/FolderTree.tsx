// FolderTree.tsx
import React, { useState } from "react";
import { Folder } from "./types";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

interface FolderTreeProps {
  folders: Folder[];
}

const FolderTree: React.FC<FolderTreeProps> = ({ folders }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setExpandedFolders((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderFolders = (folders: Folder[]) => {
    return (
      <ul style={{ listStyleType: "none", paddingLeft: "1rem" }}>
        {folders.map((folder) => (
          <li key={folder.id}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: folder.children?.length ? "pointer" : "default",
              }}
              onClick={() => folder.children?.length && toggleFolder(folder.id)}
            >
              {folder.children?.length ? (
                expandedFolders[folder.id] ? <FaChevronDown /> : <FaChevronRight />
              ) : (
                <span style={{ marginLeft: "1rem" }} />
              )}
              <span style={{ marginLeft: "0.5rem" }}>{folder.name}</span>
            </div>
            {folder.children && expandedFolders[folder.id] && renderFolders(folder.children)}
          </li>
        ))}
      </ul>
    );
  };

  return <div>{renderFolders(folders)}</div>;
};

export default FolderTree;