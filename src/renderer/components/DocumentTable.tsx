import React from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

const DocumentTable: React.FC<{ documents: string[] }> = ({ documents }) => {
  const rows: GridRowsProp = documents.map((doc, index) => ({
    id: index,
    name: doc,
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Document Name', width: 400 },
  ];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={{ pageSize: 5, page: 0 }} // Новая структура для пагинации
        // rowsPerPageOptions={[5, 10, 20]} // Опции для выбора количества строк на странице
      />
    </div>
  );
};

export default DocumentTable;