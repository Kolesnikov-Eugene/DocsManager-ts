import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableRow: React.FC<{ row: { id: number; name: string } }> = ({ row }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {row.name}
    </div>
  );
};

const DocumentTable: React.FC<{ documents: string[] }> = ({ documents }) => {
  const [docList, setDocList] = useState(documents.map((doc, index) => ({ id: index, name: doc })));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setDocList((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Document Name', width: 400, renderCell: (params) => <DraggableRow row={params.row} /> },
  ];

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={docList.map((doc) => doc.id)} strategy={verticalListSortingStrategy}>
        <div style={{ height: '100%', width: '100%' }}>
          <DataGrid rows={docList} columns={columns} paginationModel={{ pageSize: 5, page: 0 }} />
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DocumentTable;


// import React from 'react';
// import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

// const DocumentTable: React.FC<{ documents: string[] }> = ({ documents }) => {
//   const rows: GridRowsProp = documents.map((doc, index) => ({
//     id: index,
//     name: doc,
//   }));

//   const columns: GridColDef[] = [
//     { field: 'id', headerName: 'ID', width: 100 },
//     { field: 'name', headerName: 'Document Name', width: 400 },
//   ];

//   return (
//     <div style={{ height: '100%', width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         paginationModel={{ pageSize: 5, page: 0 }} // Новая структура для пагинации
//         // rowsPerPageOptions={[5, 10, 20]} // Опции для выбора количества строк на странице
//       />
//     </div>
//   );
// };

// export default DocumentTable;