import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// FolderTree.tsx
import { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
const FolderTree = ({ folders }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const toggleFolder = (id) => {
        setExpandedFolders((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    const renderFolders = (folders) => {
        return (_jsx("ul", { style: { listStyleType: "none", paddingLeft: "1rem" }, children: folders.map((folder) => (_jsxs("li", { children: [_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            cursor: folder.children?.length ? "pointer" : "default",
                        }, onClick: () => folder.children?.length && toggleFolder(folder.id), children: [folder.children?.length ? (expandedFolders[folder.id] ? _jsx(FaChevronDown, {}) : _jsx(FaChevronRight, {})) : (_jsx("span", { style: { marginLeft: "1rem" } })), _jsx("span", { style: { marginLeft: "0.5rem" }, children: folder.name })] }), folder.children && expandedFolders[folder.id] && renderFolders(folder.children)] }, folder.id))) }));
    };
    return _jsx("div", { children: renderFolders(folders) });
};
export default FolderTree;
