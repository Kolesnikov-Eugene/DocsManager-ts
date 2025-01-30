// FolderTree.tsx
import React, { useState, useRef } from "react";
import { Folder } from "./ItemTypes";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { FaFolder, FaFolderOpen } from "react-icons/fa";

interface FolderTreeProps {
  folders: Folder[];
  onFolderDrop: (targetFolderId: string, droppedItem: any) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({ folders, onFolderDrop }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setExpandedFolders((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderFolders = (folders: Folder[]) => {
    return React.createElement(
      "ul",
      { style: { listStyleType: "none", paddingLeft: "1rem" } },
      folders.map((folder) =>
        React.createElement(FolderComponent, {
          key: folder.id,
          folder: folder,
          expandedFolders: expandedFolders,
          toggleFolder: toggleFolder,
          renderFolders: renderFolders,
          onFolderDrop: onFolderDrop,
        })
      )
    );
  };

  return React.createElement("div", null, renderFolders(folders));
};

const FolderComponent: React.FC<{
  folder: Folder;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (id: string) => void;
  renderFolders: (folders: Folder[]) => React.ReactElement;
  onFolderDrop: (targetFolderId: string, droppedItem: any) => void;
}> = ({ folder, expandedFolders, toggleFolder, renderFolders, onFolderDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => {
    return {
      type: ItemTypes.FOLDER,
      item: { id: folder.id, name: folder.name },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    };
  }, [folder]);

  const [{ isOver }, drop] = useDrop(() => {
    return {
      accept: [ItemTypes.FOLDER, ItemTypes.DOCUMENT],
      drop: (item) => {
        onFolderDrop(folder.id, item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    };
  }, [onFolderDrop, folder.id]);

  const nodeRef = useRef<HTMLDivElement>(null);

  drag(nodeRef);
  drop(nodeRef);

  const folderIcon = folder.children?.length
    ? expandedFolders[folder.id]
      ? React.createElement(FaFolderOpen)
      : React.createElement(FaFolder)
    : React.createElement(FaFolder, { style: { marginLeft: "0.25rem" } });

  return React.createElement(
    "li",
    null,
    React.createElement(
      "div",
      {
        ref: nodeRef,
        style: {
          display: "flex",
          alignItems: "center",
          cursor: folder.children?.length ? "pointer" : "default",
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: isOver ? "lightblue" : "transparent",
        },
        onClick: () => folder.children?.length && toggleFolder(folder.id),
      },
      folderIcon,
      React.createElement("span", { style: { marginLeft: "0.5rem" } }, folder.name)
    ),
    folder.children && expandedFolders[folder.id] && renderFolders(folder.children)
  );
};

export default FolderTree;