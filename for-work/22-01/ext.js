// drag-n-drop
// 1 - among docs
Ext.create('Ext.grid.Panel', {
    title: 'Documents',
    store: documentsStore, // Your store for documents
    columns: [
        { text: 'Name', dataIndex: 'name', flex: 1 },
        { text: 'Size', dataIndex: 'size', flex: 1 }
    ],
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorder'
        }
    },
    height: 400,
    width: 600,
    renderTo: Ext.getBody()
});

//from docs to folders
Ext.create('Ext.tree.Panel', {
    title: 'Folders',
    width: 300,
    height: 400,
    store: foldersStore, // Your store for folders (tree structure)
    rootVisible: false,
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop'
        }
    },
    renderTo: Ext.getBody()
});

// Enable dragging in the grid
grid.viewConfig = {
    plugins: {
        ptype: 'gridviewdragdrop',
        enableDrag: true,
        enableDrop: false
    }
};

// Enable dropping in the tree
tree.viewConfig = {
    plugins: {
        ptype: 'treeviewdragdrop',
        enableDrag: false,
        enableDrop: true
    }
};

tree.getView().on('drop', function (node, data, overModel, dropPosition, eOpts) {
    const draggedRecords = data.records;
    const targetFolder = overModel.get('text');

    draggedRecords.forEach(record => {
        console.log(`Moved document "${record.get('name')}" to folder "${targetFolder}"`);
        // Implement logic to update the server or store
    });
});

// among folders
tree.viewConfig = {
    plugins: {
        ptype: 'treeviewdragdrop',
        appendOnly: false, // Allow dropping at any position
        dragText: 'Drag to reorganize'
    }
};

tree.on('drop', function (node, data, overModel, dropPosition, eOpts) {
    console.log(`Moved "${data.records[0].get('text')}" under "${overModel.get('text')}"`);
    // Implement logic to update the server or store
});


// SHIFT+CLICK selection
Ext.define('MyApp.view.DocumentsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documents',

    onBeforeSelect: function (grid, record, index, eOpts) {
        const selectionModel = grid.getSelectionModel();

        if (eOpts.shiftKey) {
            const lastSelected = selectionModel.getLastSelected();
            if (lastSelected) {
                const lastIndex = grid.getStore().indexOf(lastSelected);
                const start = Math.min(lastIndex, index);
                const end = Math.max(lastIndex, index);

                const range = [];
                for (let i = start; i <= end; i++) {
                    range.push(grid.getStore().getAt(i));
                }

                selectionModel.select(range, true); // Append to existing selection
                return false; // Prevent default selection behavior
            }
        }
    },

    onSelect: function (grid, record, index, eOpts) {
        console.log('Selected:', record.get('name'));
        // Add any additional logic for selection here
    }
});

Ext.create('Ext.grid.Panel', {
    title: 'Documents',
    store: documentsStore, // Your documents store
    columns: [
        { text: 'Name', dataIndex: 'name', flex: 1 },
        { text: 'Size', dataIndex: 'size', flex: 1 }
    ],
    selModel: {
        type: 'rowmodel', // Row selection model
        mode: 'MULTI', // Enable multi-selection
        allowDeselect: true // Allow deselecting rows
    },
    controller: 'documents', // Link to the ViewController
    listeners: {
        beforeselect: 'onBeforeSelect',
        select: 'onSelect'
    },
    height: 400,
    width: 600,
    renderTo: Ext.getBody()
});