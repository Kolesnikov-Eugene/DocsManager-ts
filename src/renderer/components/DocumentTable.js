import { jsx as _jsx } from "react/jsx-runtime";
import { DataGrid } from '@mui/x-data-grid';
const DocumentTable = ({ documents }) => {
    const rows = documents.map((doc, index) => ({
        id: index,
        name: doc,
    }));
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Document Name', width: 400 },
    ];
    return (_jsx("div", { style: { height: '100%', width: '100%' }, children: _jsx(DataGrid, { rows: rows, columns: columns, paginationModel: { pageSize: 5, page: 0 } }) }));
};
export default DocumentTable;
